$(document).on("click", ".top-btn", function(){
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    $('.tab-area > .tab').removeClass('on');
    $('.tab-area > .tab:first-child').removeClass('off');
    $('.tab-area > .tab:first-child').addClass('on');
})

$(document).on("click", "#hamburger", function () {
    $('.nav-mobile').toggleClass('show');
    $('#wrap').addClass('show');
    $('body').addClass('layer_on');
})
$(document).on("click", ".nav-mobile__header > p", function () {
    $('.nav-mobile').removeClass('show');
    $('#wrap').removeClass('show');
    $('body').removeClass('layer_on');    
})

