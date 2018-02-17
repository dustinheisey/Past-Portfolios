var textNum = 1;
var subHeading = document.getElementById("sub-heading");

window.setInterval(function(){
    
    textNum++;

    switch(textNum){
        case 1:
            subHeading.innerHTML = "I design and develop websites and apps";
            break;
        case 2:
            subHeading.innerHTML = "I draw intricate circles and lines";
            break;
        case 3:
            subHeading.innerHTML = "I blog about self-improvement";
            break;
        case 4:
            subHeading.innerHTML = "I drink a lot of coffee most days";
            textNum = 0;
            break;
    }

}, 3000);

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 2000);
});