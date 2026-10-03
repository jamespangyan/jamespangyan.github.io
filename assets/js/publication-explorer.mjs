const explorer = document.getElementById("publication-explorer");
const records = Array.from(explorer.querySelectorAll(".publication-record"));
const sections = Array.from(explorer.querySelectorAll(".publication-category"));
const search = document.getElementById("publication-search");
const year = document.getElementById("publication-year");
const topic = document.getElementById("publication-topic");
const results = document.getElementById("publication-results");
const categoryNavigation = explorer.querySelector('nav[aria-label="Publication categories"]');
const searchable = new Map(records.map(record => [record, record.textContent.toLocaleLowerCase()]));

function addOptions(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}

addOptions(year, [...new Set(records.map(record => record.dataset.year))].sort().reverse());
addOptions(topic, [...new Set(records.flatMap(record => record.dataset.topics.split("|")).filter(Boolean))].sort());

function filterPublications() {
  const query = search.value.trim().toLocaleLowerCase();
  let publications = 0;
  let patents = 0;
  for (const record of records) {
    const matches = (!query || searchable.get(record).includes(query))
      && (!year.value || record.dataset.year === year.value)
      && (!topic.value || record.dataset.topics.split("|").includes(topic.value));
    record.hidden = !matches;
    if (matches) {
      if (record.dataset.category === "patents") patents += 1;
      else publications += 1;
    }
  }
  for (const section of sections) {
    section.hidden = !Array.from(section.querySelectorAll(".publication-record")).some(record => !record.hidden);
  }
  if (categoryNavigation) categoryNavigation.hidden = Boolean(query || year.value || topic.value);
  results.textContent = publications + patents === 0
    ? "No matching entries. Try another search or clear the filters."
    : `Showing ${publications} publication${publications === 1 ? "" : "s"} and ${patents} patent or invention disclosure${patents === 1 ? "" : "s"}.`;
}

search.addEventListener("input", filterPublications);
year.addEventListener("change", filterPublications);
topic.addEventListener("change", filterPublications);
document.getElementById("publication-reset").addEventListener("click", () => {
  search.value = "";
  year.value = "";
  topic.value = "";
  filterPublications();
});
document.getElementById("publication-filters").hidden = false;
filterPublications();
