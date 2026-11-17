document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector("#items-grid");
  const search = document.querySelector("#search");
  const category = document.querySelector("#filter-category");
  const count = document.querySelector("#result-count");
  const message = document.querySelector("#list-message");
  const dialog = document.querySelector("#return-dialog");
  const confirmButton = document.querySelector("#confirm-return");
  let allItems = [];
  let selectedItemId = null;

  if (!window.acheiConfigOk) {
    grid.innerHTML = '<div class="empty-state panel">Configure o Supabase no arquivo <strong>js/supabase.js</strong> e execute o SQL do arquivo <strong>supabase-setup.sql</strong>.</div>';
    count.textContent = "Aguardando configuração";
    return;
  }

  await loadItems();
  search.addEventListener("input", renderItems);
  category.addEventListener("change", renderItems);

   
async function loadItems() {
  grid.innerHTML = '<div class="empty-state panel">Carregando objetos...</div>';

  const { data, error } = await window.acheiSupabase
    .from("items")
    .select("id, name, category, location, description, photo_url, created_at")
    .eq("status", "disponivel")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Erro ao carregar objetos:", error);

    grid.innerHTML = `
      <div class="empty-state panel">
        Não foi possível carregar os objetos.
        Verifique a conexão com o Supabase.
      </div>
    `;

    count.textContent = "Erro ao carregar";
    return;
  }

  allItems = data || [];
  renderItems();
}


  function renderItems() {
    const term = search.value.trim().toLocaleLowerCase("pt-BR");
    const selectedCategory = category.value;
    const filtered = allItems.filter(item => {
      const matchesText = `${item.name} ${item.location} ${item.description || ""}`.toLocaleLowerCase("pt-BR").includes(term);
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesText && matchesCategory;
    });

    count.textContent = `${filtered.length} ${filtered.length === 1 ? "objeto" : "objetos"}`;
    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state panel"><strong>Nenhum objeto encontrado.</strong><br>Experimente mudar a pesquisa ou o filtro.</div>';
      return;
    }

    grid.innerHTML = filtered.map(item => `
      <article class="item-card">
        <img class="item-photo" src="${window.acheiEscape(item.photo_url)}" alt="Foto de ${window.acheiEscape(item.name)}" loading="lazy">
        <div class="item-content">
          <span class="category-tag">${window.acheiEscape(item.category)}</span>
          <h3>${window.acheiEscape(item.name)}</h3>
          <p class="item-location">⌖ ${window.acheiEscape(item.location)}</p>
          ${item.description ? `<p class="item-description">${window.acheiEscape(item.description)}</p>` : ""}
          <p class="item-date">Publicado em ${window.acheiFormatDate(item.created_at)}</p>
          <button class="button button-outline full-width return-button" data-id="${window.acheiEscape(item.id)}">Marcar como devolvido</button>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll(".return-button").forEach(button => {
      button.addEventListener("click", () => {
        selectedItemId = button.dataset.id;
        dialog.showModal();
      });
    });
  }

  confirmButton.addEventListener("click", async event => {
    if (!selectedItemId) return;
    event.preventDefault();
    confirmButton.disabled = true;
    confirmButton.textContent = "Atualizando...";

    const { error } = await window.acheiSupabase
      .from("items")
      .update({ status: "devolvido" })
      .eq("id", selectedItemId);

    confirmButton.disabled = false;
    confirmButton.textContent = "Confirmar devolução";
    dialog.close();
    selectedItemId = null;

    if (error) {
      message.textContent = "Não foi possível atualizar o objeto: " + error.message;
      message.className = "form-message error";
      return;
    }

    message.textContent = "Objeto marcado como devolvido.";
    message.className = "form-message success";
    await loadItems();
  });
});
