/*
  CONFIGURAÇÃO DO SUPABASE
  1. Crie um projeto em https://supabase.com/
  2. Em Project Settings > API, copie Project URL e anon/public key.
  3. Cole os dois valores abaixo.

  A chave anon/public pode aparecer no navegador, mas SOMENTE com as
  políticas RLS configuradas no arquivo supabase-setup.sql.
*/
const SUPABASE_URL = "https://chrtezumpkstiarrnsqd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_wWQA25-4MYBphShlbX2lrQ_8ITN6TeT";

window.acheiSupabase = null;
window.acheiConfigOk = false;

if (window.supabase && SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_ANON_KEY.startsWith("COLE_AQUI")) {
  window.acheiSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.acheiConfigOk = true;
}

window.acheiFormatDate = function(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
};

window.acheiEscape = function(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
};
