var myAddress;
var blockNumber = 0;
const apiUrl = "https://api.trongrid.io";
var contractAddress = 'TErjC89GZ8rW73nckuTWm73mGJVrTY14cf';

$('.contract-address').attr('href', `https://tronscan.org/#/contract/${contractAddress}`);

const root = "http://trxfarm.com/#";

const privateKey = "3426345675785686738";
var tronWebExternal = new TronWeb(apiUrl, apiUrl, apiUrl, privateKey);

var contractExt = tronWebExternal.contract(abi, contractAddress);
var prevGameStartIn = 0;
var gameStartIn = 0;

function showToast(fill, title, content) {
  const type = ['success', 'error', 'warning', 'info'].includes(fill) ? fill : 'info'
  toastr[type](content, title)
}


var FEE_LIMIT = 1e8;

function formatNumber(value) {
  let val = (value / 1).toFixed(2).replace(/\.0+$/, '');//.replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

contractExt.DepositAt({}, {fromBlock: 0, toBlock: 'latest'}).watch(function (err, res) {
  if (res) {
    var address = tronWebExternal.address.fromHex(res.result.user);
    var amount = parseInt(res.result.amount, 10);
    showToast('success', 'Deposit', '<b>' + address.slice(0, 4) + '...' + address.slice(-4) + '</b> bought <b>' + formatNumber(amount) + ' chickens</b>');
  }
});

contractExt.IncubateAt({}, {fromBlock: 0, toBlock: 'latest'}).watch(function (err, res) {
  if (res && res.result) {
    var amount = parseFloat(res.result.amount, 10);
    var address = tronWebExternal.address.fromHex(res.result.user);
    if (address === myAddress) {
      $('.input-incubate-thumb img').attr('src', '/assets/incubate.png');

      if (amount > 0) {
        showToast('success', 'Incubate', '<b>You</b> got <b>' + amount + '</b> chickens from incubation');
      } else {
        showToast('warning', 'Incubate Failure', '<b>Incubate</b> is unsuccessful :(. Try and get more luck in next');
      }
    } else if (amount > 0) {
      showToast('success', 'Incubate Failure', '<b>' + address.slice(0, 4) + '...' + address.slice(-4) + '</b> incubate <b>' + formatNumber(amount) + ' chickens</b>');
    }
  }
});

window.setInterval(function () {
  contractExt.totalFarmers().call().then(function (res) {
    $('.totalFarmers').html(formatNumber(237 + parseFloat(res)));
  });

  contractExt.totalChicken().call().then(function (res) {
    $('.totalChicken').html(formatNumber(13570 + parseFloat(res)));
  });

  if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
    myAddress = window.tronWeb.defaultAddress.base58;

    $('.ref_banner').html(root + myAddress)

    const text = String(myAddress).substring(0, 4) + '.....' + String(myAddress).substring(myAddress.length - 4, myAddress.length);
    $('.user_login span').html(text);
    $('a[data-toggle="login"]').html(text);

    window.setTimeout(function () {
      contractExt.egg(myAddress).call().then(function (res) {
        $('.my-total-egg').html(formatNumber(parseFloat(res)));
      });

      contractExt.farmers(myAddress).call().then(function (res) {
        $('.my-total-chicken').html(formatNumber(parseFloat(res.chickens)));
        $('.my-total-sold').html(formatNumber(parseFloat(res.sold)));
        $('.total-paid').html(formatNumber(tronWebExternal.fromSun(res.withdrawn)));
        $('.dividends').html(formatNumber(tronWebExternal.fromSun(res.balance)));

        $('.referral-1').html(formatNumber(res.referrals_tier1));
        $('.referral-2').html(formatNumber(res.referrals_tier2));
        $('.referral-3').html(formatNumber(res.referrals_tier3));
        $('.referral-total').html(formatNumber(parseInt(res.referrals_tier3) + parseInt(res.referrals_tier2) + parseInt(res.referrals_tier1)));
      });
    }, 400);
  }
}, 2000)

$(".buy-now").click(function (){
  $('html, body').animate({
    scrollTop: $(".investments__stat").offset().top
  }, 1000);
});

$('.deposit-calucate').click(async function () {
  const amount = (parseFloat($('.input-calucate input').val()) || 0) * 300;

  if (amount >= 300) {
      await window.tronWeb.contract(abi, contractAddress).deposit(node).send({
        feeLimit: FEE_LIMIT,
        callValue: tronWebExternal.toSun(amount),
      })

      $('.modal-calc .close-modal').trigger('click');
      $('.input-calucate input')
      .val(0)
      .trigger('change');
  } else {
    showToast('error', 'Buy', 'Buy amount must be greater than or equal to 2 chickens');
  }
});

$('.deposit').click(async function () {
  const amount = (parseFloat($('.input-chicken input').val()) || 0) * 300;

  if (amount >= 300) {
      await window.tronWeb.contract(abi, contractAddress).deposit(node).send({
        feeLimit: FEE_LIMIT,
        callValue: tronWebExternal.toSun(amount),
      })

      $('.input-chicken input')
        .val(0)
        .trigger('change');
  } else {
    showToast('error', 'Buy', 'Buy amount must be greater than or equal to 2 chickens');
  }
});

let selling = false;
$('.selling').click(async function () {
  const total = (parseFloat($('.my-total-egg').text().replace(/,/gi, '')) || 0);
  const amount = (parseFloat($('.input-egg input').val()) || 0);

  try {
      if (!selling) {
          selling = true;
          if (amount > total) {
              showToast('error', 'Sell', 'Sell out of egg balance');
          } else if (amount >= 1) {
            await window.tronWeb.contract(abi, contractAddress).sell(amount).send({
              feeLimit: FEE_LIMIT,
              callValue: tronWebExternal.toSun(2),
            });

            $('.input-egg input')
              .val(0)
              .trigger('change');
          } else {
            showToast('error', 'Sell', 'Sell amount must be greater than or equal to 1 egg');
          }
      }
  } catch (e) {
      showToast('error', 'Sell', 'Sell amount must be greater than or equal to 1 egg');
  } finally {
      selling = false;
  }
});

$('.withdraw').click(async function () {
  try {
    await window.tronWeb.contract(abi, contractAddress).withdraw(tronWebExternal.toSun(0)).send({
      feeLimit: FEE_LIMIT,
      callValue: tronWebExternal.toSun(2),
    })
  } catch (e) {
    console.error('Withdraw:', e.message)
  }
});

$('.incubate').click(async function () {
  const total = (parseFloat($('.my-total-egg').text().replace(/,/gi, '')) || 0);
  const amount = (parseFloat($('.input-incubate input').val()) || 0);

  try {
      if (amount > total) {
          showToast('error', 'Incubate', 'Incubate out of egg balance');
      } else if (amount >= 1) {
          $('.input-incubate-thumb img').attr('src', '/assets/loading.gif');

          await window.tronWeb.contract(abi, contractAddress).incubate(amount).send({
            feeLimit: FEE_LIMIT,
            callValue: tronWebExternal.toSun(2),
          })
      } else {
          throw new Error('Incubate amount must be greater than or equal to 1 egg')
      }
  } catch (e) {
    $('.input-incubate-thumb img').attr('src', '/assets/incubate.png');
    showToast('error', 'Incubate', e.message || "Incubate was unsuccessful");
  }
});

$('.ref_banner').click(function() {
  var aux = document.createElement("input");
  // Assign it the value of the specified element
  aux.setAttribute("value", $(this).text().trim());
  // Append it to the body
  document.body.appendChild(aux);
  // Highlight its content
  aux.select();
  // Copy the highlighted text
  document.execCommand("copy");
  // Remove it from the body
  document.body.removeChild(aux);
  document.execCommand("copy");

  showToast('success', 'Copied', 'Referral is copied')
})
