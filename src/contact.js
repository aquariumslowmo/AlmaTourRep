function handleSend() {
  const toast = document.getElementById("toast");

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

}
 
// Allow Enter key to submit (Ctrl+Enter in textarea)
// document.getElementById('contactMsg').addEventListener('keydown', e => {
//   if (e.key === 'Enter' && e.ctrlKey) handleSend();
// });