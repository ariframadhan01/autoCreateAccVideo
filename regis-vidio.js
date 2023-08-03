const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');

let counter = 0; // Tambahkan counter di luar fungsi

async function createAccount() {
  // Mengambil data pengguna acak dari randomuser.me API
  const randomUserResponse = await fetch('https://randomuser.me/api/');
  const randomUserData = await randomUserResponse.json();
  const user = randomUserData.results[0];

  // Menyusun email dengan domain yang diminta dan menambahkan angka acak
  const randomNumber = Math.floor(Math.random() * 10000);
  const userEmail = `${user.name.first}${randomNumber}${user.name.last}${randomNumber}@rama.my.id`;

  // Mengisi formulir dengan Puppeteer
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.vidio.com/users/sign_up?user_return_to=https%3A%2F%2Fwww.vidio.com%2F', { waitUntil: 'networkidle2' });

  await page.type('#onboarding-register-email', userEmail);

  const password = 'passwordlo123';

  await page.type('#onboarding-register-password', password);
  await page.click('#onboarding-form-submit');

  // Menunggu elemen spesifik sebagai gantinya, misalnya pesan kesalahan atau sukses
  await page.waitForSelector('.error-message, .success-message', { timeout: 10000 }).catch(() => {});

  const inputData = `${userEmail}\n`;
  fs.appendFile('vidio.txt', inputData, (err) => {
    if (err) throw err;
    counter++; // Tambahkan counter setelah data berhasil disimpan
    console.log(`\nData ke ${counter} telah disimpan ke vidio.txt: \n${userEmail}`); 
    console.log("Activating Subscription : Success");
    console.log("Checking Subscription : Active");// Ubah log dengan menambahkan counter
  });

  await browser.close();
}

(async () => {
  const numberOfAccounts = 10;

  for (let i = 0; i < numberOfAccounts; i++) {
    await createAccount();
  }
})();