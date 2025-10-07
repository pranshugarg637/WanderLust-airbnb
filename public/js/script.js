(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  });
})();


let tax=document.querySelector("#switchCheckDefault");
let taxInfo=document.querySelectorAll("#tax-info");
tax.addEventListener("click",()=>{
  for(info of taxInfo){
    if(info.style.visibility!="visible"){
      info.style.visibility="visible";
    }
      else{
        info.style.visibility="hidden";
      }
  }
})