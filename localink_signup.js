let selectedAccountType = '';

// STEP 1 -> STEP 2
function goToStep2() {
  const selected = document.querySelector('input[name="accountType"]:checked');
  const error = document.getElementById('type-error');

  if (!selected) {
    error.textContent = 'Please choose an account type.';
    return;
  }

  error.textContent = '';
  selectedAccountType = selected.value;
  configureStep2();
  showStep(2);
}

// Changes Step 2 according to Customer, Store or Vendor.
function configureStep2() {
  const businessGroup = document.getElementById('business-group');
  const addressGroup = document.getElementById('address-group');
  const businessLabel = document.getElementById('business-label');
  const title = document.getElementById('step2-title');
  const subtitle = document.getElementById('step2-subtitle');

  // The classlist is yoused to target a css class therefore hidden is always there but .add makes that html component hide/disapear and .remove makes the html component show
  if (selectedAccountType === 'customer') {
    title.textContent = 'Tell us about yourself';
    subtitle.textContent =
      'Enter the information needed for your customer account.';
    businessGroup.classList.add('hidden');
    addressGroup.classList.remove('hidden');
  } else if (selectedAccountType === 'store') {
    title.textContent = 'Set up your store';
    subtitle.textContent =
      'Enter your details and information about your physical store.';
    businessLabel.textContent = 'Store name';
    businessGroup.classList.remove('hidden');
    addressGroup.classList.remove('hidden');
  } else {
    title.textContent = 'Set up your vendor account';
    subtitle.textContent = 'Enter your business information.';
    businessLabel.textContent = 'Business name';
    businessGroup.classList.remove('hidden');
    addressGroup.classList.remove('hidden');
  }
}

// STEP 2 -> STEP 3
function goToStep3() {
  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const businessName = document.getElementById('businessName').value;
  const address = document.getElementById('address').value;
  const error = document.getElementById('info-error');
  const selected = document.querySelector('input[name="accountType"]:checked');
  let regDetails = '';

  if (!name || !email || !phone) {
    error.textContent = 'Please complete all required fields.';
    return;
  }

  if (selectedAccountType !== 'customer') {
    const business = document.getElementById('businessName').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!business || !address) {
      error.textContent = 'Please complete the business and address fields.';
      return;
    }
  }

  error.textContent = '';
  document.getElementById('verification-contact').textContent = phone;
  showStep(3);

  if (selected.value === 'customer') {
    regDetails = {
      AccountType: selected.value,
      fullName: name,
      email: email,
      phoneNumber: phone,
      address: address,
    };
  } else if (selected.value === 'store') {
    regDetails = {
      AccountType: selected.value,
      fullName: name,
      email: email,
      phoneNumber: phone,
      storeName: businessName,
      address: address,
    };
  } else if (selected.value === 'vendor') {
    regDetails = {
      AccountType: selected.value,
      fullName: name,
      email: email,
      phoneNumber: phone,
      businessName: businessName,
      address: address,
    };
  }

  fetch('registration.php', {
    method: 'POST',
    headers: { 'content-Type': 'application/json' },
    body: JSON.stringify(regDetails),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log('Request not sent:', err);
    });
}

// STEP 3 -> STEP 4
function goToStep4() {
  const inputs = document.querySelectorAll('.otp-inputs input');
  let code = '';
  inputs.forEach((input) => (code += input.value));

  const error = document.getElementById('verification-error');

  if (code.length !== 6) {
    error.textContent = 'Please enter the 6-digit verification code.';
    return;
  }

  error.textContent = '';
  showStep(4);
}

// STEP 4 -> SUCCESS
function createAccount() {
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;
  const terms = document.getElementById('terms').checked;
  const error = document.getElementById('password-error');

  if (password.length < 8) {
    error.textContent = 'Password must contain at least 8 characters.';
    return;
  }

  if (password !== confirm) {
    error.textContent = 'Passwords do not match.';
    return;
  }

  if (!terms) {
    error.textContent =
      'You must accept the Terms of Service and Privacy Policy.';
    return;
  }

  error.textContent = '';

  // Later this will become a fetch() request to your PHP backend.
  showStep(5);
}

// Shows one step and hides the others.
function showStep(number) {
  document.querySelectorAll('.step-panel').forEach((panel) => {
    panel.classList.remove('active');
  });

  const target =
    number === 5
      ? document.getElementById('success')
      : document.getElementById('step-' + number);

  target.classList.add('active');

  // Update the progress circles.
  document.querySelectorAll('.progress-step').forEach((step) => {
    step.classList.toggle('active', Number(step.dataset.step) <= number);
  });

  document.querySelectorAll('.progress-line').forEach((line, index) => {
    line.classList.toggle('active', index < number - 1);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Automatically moves to the next OTP box after a digit is entered.
document
  .querySelectorAll('.otp-inputs input')
  .forEach((input, index, inputs) => {
    input.addEventListener('input', () => {
      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
  });
