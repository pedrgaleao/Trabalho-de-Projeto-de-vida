document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#item-form");
  const photoInput = document.querySelector("#photo");
  const preview = document.querySelector("#photo-preview");
  const previewImage = document.querySelector("#preview-image");
  const message = document.querySelector("#form-message");
  const submitButton = document.querySelector("#submit-button");

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) {
      preview.hidden = true;
      return;
    }
    if (!file.type.startsWith("image/")) {
      photoInput.value = "";
      showMessage("Selecione um arquivo de imagem.", "error");
      preview.hidden = true;
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      photoInput.value = "";
      showMessage("A imagem deve ter no máximo 5 MB.", "error");
      preview.hidden = true;
      return;
    }
    previewImage.src = URL.createObjectURL(file);
    preview.hidden = false;
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!window.acheiConfigOk) {
      showMessage("Antes de publicar, configure a URL e a chave do Supabase no arquivo js/supabase.js. Veja o README.", "error");
      return;
    }

    const file = photoInput.files[0];
    if (!file || file.size > 5 * 1024 * 1024 || !file.type.startsWith("image/")) {
      showMessage("Selecione uma imagem válida de até 5 MB.", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Publicando...";
    showMessage("Enviando seu objeto...", "info");

    const client = window.acheiSupabase;
    const extension = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filePath = `${crypto.randomUUID()}.${extension}`;

    try {
      const { error: uploadError } = await client.storage
        .from("fotos-objetos")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicData } = client.storage.from("fotos-objetos").getPublicUrl(filePath);

      const newItem = {
        name: form.name.value.trim(),
        category: form.category.value,
        location: form.location.value.trim(),
        description: form.description.value.trim(),
        photo_url: publicData.publicUrl,
        status: "disponivel"
        // created_at é preenchido automaticamente pelo banco de dados.
      };

      const { error: insertError } = await client.from("items").insert(newItem);
      if (insertError) {
        await client.storage.from("fotos-objetos").remove([filePath]);
        throw insertError;
      }

      form.reset();
      preview.hidden = true;
      showMessage("Objeto publicado! Ele já pode ser visto na página de pesquisa.", "success");
    } catch (error) {
      console.error(error);
      showMessage("Não foi possível publicar. Confira a configuração do Supabase e as políticas de acesso. Detalhe: " + error.message, "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Publicar objeto encontrado";
    }
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `form-message ${type}`;
  }
});
