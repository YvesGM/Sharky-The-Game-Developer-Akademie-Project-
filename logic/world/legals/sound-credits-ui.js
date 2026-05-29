/**
 * Initializes the sound credits list from the markdown file.
 *
 * @returns {void}
 */
export async function initSoundCreditsUI() {
    const soundCreditsList = document.getElementById("soundCreditsList");

    if (!soundCreditsList) return;

    try {
        const markdown = await loadSoundCreditsMarkdown();
        const credits = parseSoundCreditsMarkdown(markdown);

        renderSoundCredits(soundCreditsList, credits);
    } catch (error) {
        renderSoundCreditsError(soundCreditsList);
    }
}


/**
 * Loads the sound credits markdown file.
 *
 * @returns {Promise<string>} The markdown content.
 */
async function loadSoundCreditsMarkdown() {
    const response = await fetch("./SOUND_CREDITS.md");

    if (!response.ok) {
        throw new Error("Sound credits could not be loaded.");
    }

    return response.text();
}


/**
 * Parses the sound credits markdown content.
 *
 * @param {string} markdown - The markdown content.
 * @returns {Array<Object>} The parsed sound credits.
 */
function parseSoundCreditsMarkdown(markdown) {
    const sections = markdown.split("## ").slice(1);

    return sections
        .map(parseSoundCreditSection)
        .filter(credit => credit.fileName);
}


/**
 * Parses one sound credit section.
 *
 * @param {string} section - One markdown section.
 * @returns {Object} The parsed sound credit.
 */
function parseSoundCreditSection(section) {
    const lines = section
        .split("\n")
        .map(line => line.trim())
        .filter(line => line);

    const fileName = lines.shift();

    return {
        fileName,
        title: getCreditValue(lines, "Titel"),
        author: getCreditValue(lines, "Autor"),
        source: getCreditValue(lines, "Quelle"),
        link: getCreditValue(lines, "Link"),
        license: getCreditValue(lines, "Lizenz"),
        downloadDate: getCreditValue(lines, "Download-Datum")
    };
}


/**
 * Returns one value from the credit lines.
 *
 * @param {Array<string>} lines - The markdown lines.
 * @param {string} key - The searched key.
 * @returns {string} The found value.
 */
function getCreditValue(lines, key) {
    const line = lines.find(entry => entry.startsWith(`- ${key}:`));

    if (!line) return "";

    return line.replace(`- ${key}:`, "").trim();
}


/**
 * Renders all sound credits into the list.
 *
 * @param {HTMLElement} soundCreditsList - The credits list element.
 * @param {Array<Object>} credits - The parsed credits.
 * @returns {void}
 */
function renderSoundCredits(soundCreditsList, credits) {
    soundCreditsList.innerHTML = "";

    credits.forEach(credit => {
        if (!hasVisibleCreditData(credit)) return;

        const listItem = createSoundCreditListItem(credit);
        soundCreditsList.appendChild(listItem);
    });

    if (!soundCreditsList.children.length) {
        soundCreditsList.innerHTML = "<li>Noch keine Soundquellen eingetragen.</li>";
    }
}


/**
 * Checks whether a credit has visible data.
 *
 * @param {Object} credit - One parsed credit.
 * @returns {boolean} Whether the credit should be rendered.
 */
function hasVisibleCreditData(credit) {
    return credit.title ||
        credit.author ||
        credit.source ||
        credit.link ||
        credit.license;
}


/**
 * Creates one sound credit list item.
 *
 * @param {Object} credit - One parsed credit.
 * @returns {HTMLLIElement} The list item.
 */
function createSoundCreditListItem(credit) {
    const listItem = document.createElement("li");

    const title = credit.title || "Titel unbekannt";
    const author = credit.author || "Autor unbekannt";
    const source = credit.source || "Quelle unbekannt";
    const license = credit.license || "Lizenz unbekannt";

    listItem.innerHTML = `
        <strong>${escapeHTML(credit.fileName)}</strong><br>
        „${escapeHTML(title)}“ von ${escapeHTML(author)}<br>
        Quelle: ${createSourceHTML(source, credit.link)}<br>
        Lizenz: ${escapeHTML(license)}
        ${createDownloadDateHTML(credit.downloadDate)}
    `;

    return listItem;
}


/**
 * Creates the source HTML.
 *
 * @param {string} source - The source name.
 * @param {string} link - The source link.
 * @returns {string} The source HTML.
 */
function createSourceHTML(source, link) {
    const safeSource = escapeHTML(source || "Quelle unbekannt");
    const safeLink = escapeHTML(link);

    if (!link) return safeSource;

    return `<a href="${safeLink}" target="_blank" rel="noopener noreferrer">${safeSource}</a>`;
}


/**
 * Creates the download date HTML.
 *
 * @param {string} downloadDate - The download date.
 * @returns {string} The download date HTML.
 */
function createDownloadDateHTML(downloadDate) {
    if (!downloadDate) return "";

    return `<br>Download-Datum: ${escapeHTML(downloadDate)}`;
}


/**
 * Renders an error message.
 *
 * @param {HTMLElement} soundCreditsList - The credits list element.
 * @returns {void}
 */
function renderSoundCreditsError(soundCreditsList) {
    soundCreditsList.innerHTML = "<li>Soundquellen konnten nicht geladen werden.</li>";
}


/**
 * Escapes HTML to prevent broken markup.
 *
 * @param {string} value - The raw value.
 * @returns {string} The escaped value.
 */
function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}