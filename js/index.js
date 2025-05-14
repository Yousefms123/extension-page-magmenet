const themeBtn = document.getElementById("theme-btn");
const searchInput = document.getElementById("search");
const extensionsGrid = document.getElementById("extensions-grid");
const filterContainer = document.getElementById("filter-btns");
const filterBtns = document.querySelectorAll(".filter-btn");

let extensionsData = [];
let currentFilter = "all";

async function fetchExtensions() {
	try {
		const res = await fetch("data.json");
		extensionsData = await res.json();
		applyFilter(currentFilter);
	} catch (err) {
		console.error("Failed to fetch data:", err);
	}
}

function displayExtensions(extensions) {
	if (!extensions || extensions.length === 0) {
		extensionsGrid.innerHTML = "<p>There are no Extension to display.</p>";
		return;
	}

	extensionsGrid.innerHTML = extensions.map((extension) => createExtensionElement(extension)).join("");
}

function createExtensionElement(extension) {
	return `
		<div class="item" data-name="${extension.name}">
			<div class="top">
				<img src="${extension.logo}" alt="${extension.name}" />
				<div class="extension-info">
					<h3 class="name">${extension.name}</h3>
					<p class="description">${extension.description}</p>
				</div>
			</div>
			<div class="bottom">
				<button class="remove-btn">Remove</button>
				<div class="form-check form-switch">
					<input class="form-check-input toggle-input" type="checkbox" role="switch" id="toggle-${extension.name}" ${
		extension.isActive ? "checked" : ""
	} />
					<label class="form-check-label" for="toggle-${extension.name}"></label>
				</div>
			</div>
		</div>
	`;
}

function applyFilter(filter) {
	currentFilter = filter;
	filterBtns.forEach((btn) => {
		btn.classList.toggle("active", btn.id === filter);
	});
	let filterData;
	switch (filter) {
		case "all":
			filterData = extensionsData;
			break;
		case "active":
			filterData = extensionsData.filter((extension) => extension.isActive);
			break;
		case "inActive":
			filterData = extensionsData.filter((extension) => !extension.isActive);
			break;
	}
	console.log("Filter: ", filter);
	console.log("Result: ", filterData);
	displayExtensions(filterData);
}

function searching() {
	const searchValue = searchInput.value.toLowerCase();
	const filteredExtensions = extensionsData.filter((extension) =>
		extension.name.toLowerCase().includes(searchValue)
	);
	displayExtensions(filteredExtensions);

	if (filteredExtensions.length === 0) {
		extensionsGrid.innerHTML = `<p class="empty">There are no items containing <b>"${searchValue}"</b></p>`;
	}
}

themeBtn.addEventListener("click", toggleTheme);
filterContainer.addEventListener("click", handleFilterClick);
extensionsGrid.addEventListener("click", handleGridClick);
extensionsGrid.addEventListener("change", handleToggle);
searchInput.addEventListener("input", searching);

function toggleTheme() {
	const currentTheme = document.documentElement.getAttribute("data-theme");
	const newTheme = currentTheme === "dark" ? "light" : "dark";
	document.documentElement.setAttribute("data-theme", newTheme);
	themeBtn.innerHTML = newTheme === "dark" ? `<i class="bx bx-sun"></i>` : `<i class="bx bx-moon"></i>`;
	localStorage.setItem("theme", newTheme);
}

function handleFilterClick(e) {
	if (e.target.classList.contains("filter-btn")) {
		applyFilter(e.target.id);
	}
}
function handleGridClick(e) {
	if (e.target.classList.contains("remove-btn")) {
		const item = e.target.closest(".item");
		const name = item.dataset.name;
		extensionsData = extensionsData.filter((extension) => extension.name !== name);
		applyFilter(currentFilter);
	}
}

function handleToggle(e) {
	if (e.target.classList.contains("toggle-input")) {
		const item = e.target.closest(".item");
		const name = item.dataset.name;
		const extension = extensionsData.find((extension) => extension.name === name);
		if (extension) {
			extension.isActive = e.target.checked;
		}
	}
}

fetchExtensions();
