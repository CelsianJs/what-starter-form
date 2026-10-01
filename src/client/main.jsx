import { mount, useComputed, useEffect, useSignal } from 'what-framework';

const STORAGE = 'form-proposal';
const data = safeJson(decodeEntities(document.querySelector('#form-data')?.textContent || '')) || { projects: [], proposalDefaults: {} };
const fallback = new Map();

function FilterIsland() {
  const active = useSignal('all');
  const types = ['all', ...new Set(data.projects.map((project) => project.type))];
  const results = useComputed(() => active() === 'all' ? data.projects : data.projects.filter((project) => project.type === active()));
  return (
    <>
      <div class="filters" aria-label="Project filters">
        {types.map((type) => <button type="button" aria-pressed={() => active() === type ? 'true' : 'false'} onClick={() => active(type)}>{type}</button>)}
      </div>
      <p aria-live="polite">{() => `${results().length} project${results().length === 1 ? '' : 's'} shown`}</p>
      <div class="project-grid">
        {() => results().map((project) => (
          <a class="project-card" href={`/projects/${project.slug}`}>
            <div class="study"><svg viewBox="0 0 420 300"><rect x="20" y="28" width="380" height="244" fill="none" stroke={project.accent} stroke-width="3" /><path d="M55 238 L120 94 L184 238 M120 94 L312 94 L365 238" fill="none" stroke="#151515" stroke-width="5" /><rect x="206" y="122" width="86" height="116" fill={project.accent} opacity=".14" stroke={project.accent} /></svg></div>
            <div><p class="meta">{project.type} · {project.year}</p><h3>{project.title}</h3><p>{project.summary}</p></div>
          </a>
        ))}
      </div>
    </>
  );
}

function ProposalIsland() {
  const storageStatus = useSignal('persistent');
  const initial = normalize(safeJson(safeGet(STORAGE, storageStatus)) || data.proposalDefaults);
  const client = useSignal(initial.client);
  const site = useSignal(initial.site);
  const scope = useSignal(initial.scope);
  const budget = useSignal(initial.budget);
  const status = useSignal('Not downloaded yet.');
  const output = useComputed(() => `FORM PROPOSAL BRIEF\n\nClient: ${client()}\nSite: ${site()}\nScope: ${scope()}\nBudget: ${budget()}\n\nPrepared locally in the Form starter.`);

  useEffect(() => {
    safeSet(STORAGE, JSON.stringify({ client: client(), site: site(), scope: scope(), budget: budget() }), storageStatus);
  });

  function download() {
    const blob = new Blob([output()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-proposal-brief.txt';
    a.hidden = true;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    status('Downloaded form-proposal-brief.txt');
  }

  return (
    <>
      <div class="brief">
        <label>Client<input value={client} onInput={(event) => client(event.target.value)} /></label>
        <label>Site<input value={site} onInput={(event) => site(event.target.value)} /></label>
        <label>Scope<textarea rows="5" value={scope} onInput={(event) => scope(event.target.value)} /></label>
        <label>Budget<input value={budget} onInput={(event) => budget(event.target.value)} /></label>
        <button type="button" onClick={download}>Download brief</button>
        <p aria-live="polite">{() => status()}</p>
        <p class="storage-note" hidden={() => storageStatus() === 'persistent'}>Storage is unavailable in this browser context. Edits stay in memory until this tab closes.</p>
      </div>
      <pre class="brief" aria-label="Proposal preview">{() => output()}</pre>
    </>
  );
}

function normalize(value) {
  return {
    client: typeof value?.client === 'string' ? value.client : data.proposalDefaults.client,
    site: typeof value?.site === 'string' ? value.site : data.proposalDefaults.site,
    scope: typeof value?.scope === 'string' ? value.scope : data.proposalDefaults.scope,
    budget: typeof value?.budget === 'string' ? value.budget : data.proposalDefaults.budget,
  };
}

function safeJson(value) { try { return value ? JSON.parse(value) : null; } catch { return null; } }
function safeGet(key, status) { try { return localStorage.getItem(key); } catch { status('memory'); return fallback.get(key) || null; } }
function safeSet(key, value, status) { try { localStorage.setItem(key, value); } catch { status('memory'); fallback.set(key, value); } }
function decodeEntities(value) { const textarea = document.createElement('textarea'); textarea.innerHTML = value; return textarea.value; }

const filter = document.querySelector('#project-filter');
if (filter) mount(<FilterIsland />, filter);
const proposal = document.querySelector('#proposal-island');
if (proposal) mount(<ProposalIsland />, proposal);
