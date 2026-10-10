const storageKey = "runbook-trial-tasks";
const initial = [
  { id: "paragraph", title: "Check paragraph typography", notes: "Compare the 120-character paragraph in the real editor and exported PNG. Preserve explicit line breaks and inspect mixed-language content.", due: "2026-10-11", priority: "high", status: "working" },
  { id: "mobile", title: "Test mobile editing", notes: "Keep the artwork visible while changing weight and palette. Exercise the family and saved-study panels at 390px and 320px.", due: "2026-10-11", priority: "high", status: "open" },
  { id: "viewer", title: "Review the photo viewer", notes: "Inspect image framing, notes, source credit, and native dialog focus at a short landscape viewport.", due: "2026-10-12", priority: "normal", status: "open" },
  { id: "research", title: "Read the design research corpus", notes: "Review the public design skills and primary designer workflow sources recorded in docs/research-synthesis.md.", due: "2026-10-10", priority: "normal", status: "done" }
];
function validTask(task) { return task && typeof task.id === "string" && typeof task.title === "string" && task.title.trim().length > 0 && task.title.length <= 180 && typeof task.notes === "string" && task.notes.length <= 2000 && ["open", "working", "done"].includes(task.status) && ["normal", "high", "low"].includes(task.priority) && typeof task.due === "string" && (!task.due || /^\d{4}-\d{2}-\d{2}$/.test(task.due)); }
let tasks = initial.map(task => ({ ...task }));
try { const stored = JSON.parse(localStorage.getItem(storageKey)); if (Array.isArray(stored) && stored.every(validTask)) tasks = stored; } catch {}
let selected = tasks[0]?.id;
let filter = "open";
let query = "";
let editing = null;
let removed = null;
let returnFocus = null;
const compact = matchMedia("(max-width: 720px)");
const taskDialog = document.querySelector("#task-dialog");
const editDialog = document.querySelector("#edit-dialog");
const list = document.querySelector("#task-list");
const today = new Date(); const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
const dateFormat = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
function dateLabel(value) { return value ? dateFormat.format(new Date(`${value}T12:00:00`)) : "No date"; }
function node(tag, className, text) { const element = document.createElement(tag); element.className = className; if (text !== undefined) element.textContent = text; return element; }
function icon(name) { const element = document.createElement("i"); element.dataset.lucide = name; element.setAttribute("aria-hidden", "true"); return element; }
function notify(text, undoable = false) { document.querySelector("#status-text").textContent = text; document.querySelector("#undo").hidden = !undoable; document.querySelector("#status").hidden = false; }
function persist(next) { try { localStorage.setItem(storageKey, JSON.stringify(next)); tasks = next; return true; } catch { notify("Changes could not be saved on this device."); return false; } }
function setStatus(id, done) {
  const fromDetail = document.activeElement?.closest(".detail-state");
  const next = tasks.map(task => task.id === id ? { ...task, status: done ? "done" : "open" } : task);
  if (persist(next)) {
    render();
    if (fromDetail) document.querySelector(`${taskDialog.open ? "#detail-mobile" : "#detail-rail"} .detail-state input`)?.focus();
    else focusTask(id);
    notify(done ? "Task completed" : "Task reopened");
  }
}
function visibleTasks() { return tasks.filter(task => (filter === "all" || (filter === "done" ? task.status === "done" : task.status !== "done")) && `${task.title} ${task.notes}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())); }
function alignSelection() { if (!visibleTasks().some(task => task.id === selected)) selected = visibleTasks()[0]?.id; }
function renderDetail(container) {
  container.replaceChildren();
  const task = tasks.find(item => item.id === selected);
  if (!task) { container.append(node("p", "detail-empty", "Select a task")); return; }
  const kicker = node("div", "detail-kicker"); kicker.append(node("span", "", "TASK DETAILS"), node("span", "", task.status === "working" ? "Working" : task.status === "done" ? "Completed" : "Open"));
  const title = node("h2", "detail-title", task.title);
  const stateLabel = node("label", "detail-state"); const done = document.createElement("input"); done.type = "checkbox"; done.checked = task.status === "done"; done.addEventListener("change", () => setStatus(task.id, done.checked)); stateLabel.append(done, document.createTextNode(task.status === "done" ? "Completed" : "Mark complete"));
  const facts = node("div", "detail-facts");
  for (const [label, value] of [["DUE DATE", dateLabel(task.due)], ["PRIORITY", task.priority[0].toUpperCase() + task.priority.slice(1)]]) { const fact = node("div", ""); fact.append(node("span", "detail-label", label), node("p", "", value)); facts.append(fact); }
  const actions = node("div", "detail-actions"); const edit = node("button", "secondary", "Edit task"); edit.type = "button"; edit.prepend(icon("pencil")); edit.addEventListener("click", () => openForm(task));
  const remove = node("button", "icon-button"); remove.type = "button"; remove.setAttribute("aria-label", "Remove task"); remove.title = "Remove task"; remove.append(icon("trash-2")); remove.addEventListener("click", () => { const next = tasks.filter(item => item.id !== task.id); if (persist(next)) { removed = task; selected = visibleTasks()[0]?.id; taskDialog.close(); render(); notify("Task removed", true); } });
  actions.append(edit, remove); container.append(kicker, title, stateLabel, facts, node("span", "detail-label", "NOTES"), node("p", "detail-notes", task.notes || "No notes"), actions);
}
function render() {
  const visible = visibleTasks();
  if (!tasks.some(task => task.id === selected)) selected = visible[0]?.id;
  list.replaceChildren();
  for (const task of visible) {
    const row = node("div", `task-row${task.id === selected ? " selected" : ""}${task.status === "done" ? " completed" : ""}`);
    row.dataset.taskId = task.id;
    const check = document.createElement("input"); check.type = "checkbox"; check.checked = task.status === "done"; check.setAttribute("aria-label", `Complete ${task.title}`); check.addEventListener("change", () => setStatus(task.id, check.checked));
    const open = node("button", "task-open"); open.type = "button"; open.append(node("strong", "", task.title));
    const meta = node("span", "task-meta"); meta.append(node("span", `state-dot ${task.status}`), document.createTextNode(task.status === "working" ? "Working" : task.status === "done" ? "Completed" : "Open")); if (task.priority === "high") meta.append(node("span", "priority-high", "High priority")); open.append(meta);
    open.addEventListener("click", () => { selected = task.id; render(); if (compact.matches) { returnFocus = task.id; taskDialog.showModal(); } });
    row.append(check, open, node("span", `due-date${task.due && task.due < todayKey && task.status !== "done" ? " overdue" : ""}`, dateLabel(task.due))); list.append(row);
  }
  document.querySelector("#open-count").textContent = String(tasks.filter(task => task.status !== "done").length);
  document.querySelector("#done-count").textContent = String(tasks.filter(task => task.status === "done").length);
  document.querySelectorAll("[data-filter]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === filter)));
  document.querySelector("#empty").hidden = visible.length > 0;
  document.querySelector("#empty-title").textContent = query ? "No matching tasks" : filter === "done" ? "No completed tasks" : "No tasks in this view";
  document.querySelector("#empty-action").textContent = query ? "Clear search" : "Add a task";
  document.querySelector("#list-summary").textContent = `${visible.length} ${visible.length === 1 ? "task" : "tasks"} in this view`;
  renderDetail(document.querySelector("#detail-rail")); renderDetail(document.querySelector("#detail-mobile")); lucide.createIcons();
}
function openForm(task = null) { editing = task?.id ?? null; document.querySelector("#form-title").textContent = editing ? "Edit task" : "Add task"; document.querySelector("#title").value = task?.title || ""; document.querySelector("#notes").value = task?.notes || ""; document.querySelector("#due").value = task?.due || ""; document.querySelector("#priority").value = task?.priority || "normal"; document.querySelector("#form-error").textContent = ""; editDialog.showModal(); }
document.querySelector("#add").addEventListener("click", () => openForm());
document.querySelector("#cancel").addEventListener("click", () => editDialog.close());
document.querySelector("#close-detail").addEventListener("click", () => taskDialog.close());
function focusTask(id) { const row = [...list.children].find(element => element.dataset.taskId === id); (row?.querySelector(".task-open") || list.querySelector(".task-open") || document.querySelector("#add")).focus(); }
taskDialog.addEventListener("close", () => { if (returnFocus) { focusTask(returnFocus); returnFocus = null; } });
editDialog.addEventListener("close", () => { if (taskDialog.open) document.querySelector("#detail-mobile .secondary")?.focus(); else if (editing) focusTask(selected); else document.querySelector("#add").focus(); });
compact.addEventListener("change", () => { if (!compact.matches) taskDialog.close(); });
document.querySelector("#search").addEventListener("input", event => { query = event.target.value.trim(); alignSelection(); render(); });
document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => { filter = button.dataset.filter; alignSelection(); render(); }));
document.querySelector("#empty-action").addEventListener("click", () => { if (query) { document.querySelector("#search").value = ""; query = ""; alignSelection(); render(); document.querySelector("#search").focus(); } else openForm(); });
document.querySelector("#task-form").addEventListener("submit", event => {
  event.preventDefault(); const title = document.querySelector("#title").value.trim(); if (!title) { document.querySelector("#form-error").textContent = "Enter a task name."; document.querySelector("#title").focus(); return; }
  const previous = tasks.find(task => task.id === editing);
  const task = { id: editing || crypto.randomUUID(), title, notes: document.querySelector("#notes").value.trim(), due: document.querySelector("#due").value, priority: document.querySelector("#priority").value, status: previous?.status || "open" };
  if (persist(editing ? tasks.map(item => item.id === editing ? task : item) : [...tasks, task])) { if (!editing) { filter = "open"; query = ""; document.querySelector("#search").value = ""; } selected = task.id; editDialog.close(); render(); notify(editing ? "Task updated" : "Task added"); }
});
document.querySelector("#undo").addEventListener("click", () => { if (removed && persist([...tasks, removed])) { selected = removed.id; removed = null; render(); notify("Task restored"); } });
document.querySelector("#export").addEventListener("click", () => { const blob = new Blob([JSON.stringify({ format: "runbook-v1", tasks }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "runbook-tasks.json"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); notify("Tasks exported"); });
render();
