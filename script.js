const WA = "923064894191";
const CATS = ["Office Assistant","Data Entry Operator","Computer Operator","Receptionist","Admin Assistant","Clerk","Typist","Office Coordinator","Personal Assistant"];
// DEMO jobs only. Replace with real listings when you have them.
const JOBS = CATS.map((c, i) => ({
  id: i + 1, title: c, company: "Demo Company " + String.fromCharCode(65 + i),
  location: ["Lahore","Sheikhupura","Faisalabad","Gujranwala","Islamabad"][i % 5],
  category: c, type: ["Full-time","Part-time","Contract"][i % 3],
  salary: 28000 + (i % 5) * 6000, exp: i % 3,
  qual: ["Intermediate","Bachelor's","Diploma"][i % 3],
  skills: ["MS Office","Typing","Communication","Filing"].slice(0, 2 + (i % 3)),
  desc: "Demo listing for the " + c + " role. This is a sample, not a real vacancy.",
  deadline: "2026-12-" + String(10 + i).padStart(2, "0")
}));
const $ = id => document.getElementById(id);
let saved = [];
try { saved = JSON.parse(localStorage.getItem("saved") || "[]"); } catch (e) {}
let onlySaved = false;
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
const fmt = n => "PKR " + n.toLocaleString("en-US");
const expTxt = n => n === 0 ? "Fresher" : n + "+ years";

CATS.forEach(c => {
  $("fcat").add(new Option(c, c));
  const d = el("div", "card", c); d.tabIndex = 0;
  const go = () => { $("fcat").value = c; render(); location.hash = "jobs"; };
  d.onclick = go; d.onkeydown = e => { if (e.key === "Enter") go(); };
  $("catGrid").append(d);
});

function render() {
  const q = $("fq").value.toLowerCase(), loc = $("floc").value.toLowerCase();
  const list = JOBS.filter(j =>
    (!q || (j.title + j.skills.join(" ")).toLowerCase().includes(q)) &&
    (!loc || j.location.toLowerCase().includes(loc)) &&
    (!$("fcat").value || j.category === $("fcat").value) &&
    (!$("ftype").value || j.type === $("ftype").value) &&
    (!$("fexp").value || j.exp >= +$("fexp").value) &&
    j.salary >= +$("fsal").value &&
    (!onlySaved || saved.includes(j.id)));
  $("count").textContent = list.length + " job(s) found";
  $("list").replaceChildren(...list.map(card));
}
function card(j) {
  const c = el("div", "card");
  c.append(el("span", "tag", "DEMO"), el("h3", "", j.title),
    el("div", "", j.company + " · " + j.location), el("div", "", fmt(j.salary) + " · " + j.type));
  const r = el("div", "row");
  const d = el("button", "btn small", "Details"); d.onclick = () => details(j);
  const b = el("button", "btn small ghost", saved.includes(j.id) ? "Saved ✓" : "Save");
  b.onclick = () => { saved = saved.includes(j.id) ? saved.filter(x => x !== j.id) : [...saved, j.id];
    try { localStorage.setItem("saved", JSON.stringify(saved)); } catch (e) {} render(); };
  r.append(d, b); c.append(r); return c;
}
function details(j) {
  const rows = [["Company", j.company], ["Location", j.location], ["Salary", fmt(j.salary)],
    ["Qualification", j.qual], ["Experience", expTxt(j.exp)], ["Skills", j.skills.join(", ")],
    ["Deadline", j.deadline], ["Description", j.desc]];
  const body = $("dlgBody"); body.replaceChildren(el("h3", "", j.title + " (DEMO)"));
  rows.forEach(([k, v]) => { const p = el("p"); p.append(el("b", "", k + ": "), document.createTextNode(v)); body.append(p); });
  const a = el("a", "btn", "Apply Now"); a.target = "_blank"; a.rel = "noopener";
  a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent("Hello, I want to apply for: " + j.title + " (" + j.company + ")");
  body.append(a); $("dlg").showModal();
}
$("closeDlg").onclick = () => $("dlg").close();
["fq","floc"].forEach(i => $(i).oninput = render);
["fcat","ftype","fexp","fsal"].forEach(i => $(i).onchange = render);
$("showSaved").onclick = e => { onlySaved = !onlySaved; e.target.textContent = onlySaved ? "Show all jobs" : "Show saved jobs"; render(); };
$("menuBtn").onclick = e => { const o = $("menu").classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", o); };
$("menu").onclick = () => $("menu").classList.remove("open");

function handle(formId, errId, check, build) {
  $(formId).onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target), v = n => (f.get(n) || "").trim();
    const err = check(v); $(errId).textContent = err || "";
    if (!err) { window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(build(v)), "_blank", "noopener"); e.target.reset(); }
  };
}
handle("postForm", "postErr",
  v => (v("company").length < 2 || v("title").length < 2 || !v("salary") || v("desc").length < 10 || !v("qual") || !v("contact"))
    ? "Please fill in every field (description at least 10 characters)." : "",
  v => `New job post for review\nCompany: ${v("company")}\nTitle: ${v("title")}\nSalary: ${v("salary")}\nQualifications: ${v("qual")}\nDescription: ${v("desc")}\nContact: ${v("contact")}`);
handle("contactForm", "contactErr",
  v => (!v("name") || v("msg").length < 5) ? "Please enter your name and a message." : "",
  v => `Message from ${v("name")}:\n${v("msg")}`);
$("waBtn").href = "https://wa.me/" + WA;
render();
