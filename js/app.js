function closeModal() {
  $(`[data-modal]`).removeClass('active');
  return false
}

$(document).ready(function() {
$('.input-chicken input').change(function() {
  $('.chicken-amount').text(parseInt($(this).val(), 10) * 300)
});

$('.input-chicken input').keyup(function() {
  $(this).trigger('change');
});

$('.input-egg input').change(function() {
  $('.egg-amount').text(parseInt($(this).val(), 10))
});

$('.input-egg input').keyup(function() {
  $(this).trigger('change');
});

$('.input-calucate input').change(function() {
  $('.egg-profit').text(parseInt($(this).val(), 10))
  $('.calculate-amount').text(parseInt($(this).val(), 10) * 300)
});

$('.input-calucate input').keyup(function() {
  $(this).trigger('change');
});
});

$('body').on('click', '.read_more', function () {
  $(this).parent().find('div').css({height: 'auto'});
  $(this).hide();
  return false;
});

function openModal(name) {
  $(`[data-modal]`).removeClass('active');
  $(`[data-modal="${name}"]`).addClass('active');

  $('.modal').on('click', function (e) {
      if (!$(e.target).closest('.modal-container').length) {
          closeModal();
          $('.modal-container').unbind();
      }
  })

  return false
}


var first_modal = ''
$('body').on('click', '.faq__item', function () {
  if ($(this).hasClass('active')) {
      return
  }

  let e = $('.faq__item.active');
  $(e).find('.faq__answer').css({height: 0 + 'px'})
  setTimeout(() => {
      $(e).removeClass('active');
  }, 400)

  let height = $(this).find('p').innerHeight();
  $(this).addClass('active');
  $(this).find('.faq__answer').css({height: height + 38 + 'px'})
  setTimeout(() => {
      $(this).find('.faq__answer').css({height: 'auto'})
  }, 400)
});

$('body').on('click', '.modal__header button , .close-modal', function () {
  $(this).parents('.modal').removeClass('active');
})


$('body').on('click', '.btn-menu', function () {
  first_modal = 'menu'
  $('[data-modal="menu"]').addClass('active')
  return false;
})

$('body').on('click', '[data-toggle]', function () {
  if ($(this).data('toggle') === 'back') {
      $('.modal.active').removeClass('active');
      $(`[data-modal="${first_modal}"]`).addClass('active');
      return false
  } else {
      if ($(this).data('toggle') !== 'lang') {
          first_modal = $(this).data('toggle');
      }
  }
  $('.modal.active').removeClass('active');
  $(`[data-modal="${$(this).data('toggle')}"]`).addClass('active');

  $('.modal').on('click', function (e) {
      if (!$(e.target).closest('.modal-container').length) {
          closeModal();
          $('.modal-container').unbind();
      }
  })
  return false
})

function countdown(end, now = new Date().getTime() / 1000) {
  // Get today's date and time
  var distance = (end - now) * 1000;
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  if (String(seconds).length === 1) seconds = '0' + seconds;
  if (String(minutes).length === 1) minutes = '0' + minutes;
  if (String(hours).length === 1) hours = '0' + hours;
  if (String(days).length === 1) days = '0' + days;
  // Display the result in the element with id="demo"
  return days + ":" + hours + ":" + minutes + ":" + seconds + "";
}

function aviable(date_withdraw, date_end, amount, now = new Date().getTime()) {

  let time = now <= date_end ? now - date_withdraw : date_end - date_withdraw;

  let pay = ((amount * 1.8) / 777600) * time;
  return pay;
}

function initSlider() {
  new Swiper('.swiper-container', {
      // loop: true,
      effect: 'fade',
      autoplay: {
          delay: 5000,
      },
      pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
      },
  })
}

initSlider();
