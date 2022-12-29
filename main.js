const form = document.getElementById('form');
const inputs = document.querySelectorAll('input');

function isEveryInputEmpty() {
    let allEmpty = true;
    inputs.forEach(function(el) {
        if(el.nextElementSibling){
            el.nextElementSibling.remove()
            el.classList.add('addSpace')
        }
        if (el.value === '') {
            validateFormatField(el,true)
            allEmpty=false
            return false;
        }else {
            el.dataset.state = 'valid'
        }
    });

    return allEmpty;
}
const validateFormatField = (elementHtml, isBlank) =>{
    elementHtml.dataset.state = 'invalid'
    elementHtml.classList.remove('addSpace')
    if(isBlank){
        elementHtml.insertAdjacentHTML("afterend", '<div class="error" style="color:red">Can\'t be blank</div>');   
    }
    if(isBlank===undefined){
        elementHtml.insertAdjacentHTML("afterend", '<div class="errorFormat" style="color:red">Wrong format, number only</div>');
    }
}
const isValidateField = () =>{
    let isValid = true;
    const month=document.getElementById('card-date-mm')
    const year = document.getElementById('card-date-yy')
    const cvc = document.getElementById('card-cvc')
    const numberCard= document.getElementById('card-number')
    if(isNaN(month.value) || parseInt(month.value)>12 || parseInt(month.value)<1){
        validateFormatField(month)
        return false;
    }
    if(isNaN(year.value) || parseInt(year.value)<1){
        validateFormatField(year)
        return false;
    }
    if(isNaN(cvc.value) || parseInt(cvc.value)<100){
        validateFormatField(cvc)
        return false;
    }
    if(isNaN(numberCard.value)){
        validateFormatField(numberCard)
        return false;
    }
    return isValid;
}
const handleSubtmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const emptyInput=isEveryInputEmpty();
    const isValid=isValidateField();
    if(emptyInput && isValid){
        const URL = 'http://localhost:3000/dataCardUser'
        const responseGet = fetch(URL);
        responseGet.then(response => response.json()) 
        .then(data => {
            const dataCardUser=data
            let newObject={}
            inputs.forEach(function(el) {
                newObject[el.id]=el.value;
            });        
            const responsePost = fetch(URL, {
                method: "POST",
                body: JSON.stringify(newObject),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            });
            responsePost.then(response => response.json()) 
            .then(json => {
                dataCardUser.push(json)
                localStorage.setItem('dataCardUser',JSON.stringify(dataCardUser))
                const success= document.getElementById('success');
                const formData= document.getElementById('form');
                formData.classList.add('hidden')
                success.classList.remove('hidden')
            })
        })
    }
}

addEventListener("submit", handleSubtmit);

const changeDataCard= (currentValue,elementId, defaultText) =>{
    const cardField= document.getElementById(elementId);
    const value= currentValue
    if(value){
        cardField.innerHTML= value.toUpperCase();
    } else {
        cardField.innerHTML= defaultText;
    }
}

form.addEventListener('input',(e) =>{
    e.preventDefault();
    e.stopPropagation();
    if(e.target.id === 'card-name') {
        changeDataCard(e.target.value,'cardName','JANE APPLESEED')
    }
    if(e.target.id === 'card-number') {

        changeDataCard(e.target.value ? e.target.value.match(/.{1,4}/g).join(' '): '','cardNumber','0000 0000 0000 0000')
    }
    if(e.target.id === 'card-date-mm') {
        changeDataCard(e.target.value,'cardMonth','00')
    }
    if(e.target.id === 'card-date-yy') {
        changeDataCard(e.target.value,'cardYear','00')
    }
    if(e.target.id === 'card-cvc') {
        changeDataCard(e.target.value,'cvc','000')
    }
})

const handleSubtmitSuccess = (e) =>{
    e.preventDefault();
    e.stopPropagation();
    const success= document.getElementById('success');
    const formData= document.getElementById('form');
    success.classList.add('hidden')
    formData.classList.remove('hidden')
    form.reset();
}
document.getElementById("success-button").addEventListener("click", handleSubtmitSuccess);
