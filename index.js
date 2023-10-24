require('dotenv').config();
const { Bannerbear } = require('bannerbear');
const bb = new Bannerbear("your_api_key");

// for reading csv
const fs = require('fs');
const { parse } = require('csv-parse');

// const staffs = [
//   {
//     name: 'John Doe',
//     job_title: 'Chief Director',
//     mobile: '+1222222222',
//     email: 'john.doe@drtech.com',
//     qr_link: 'https://www.drtech.com/johndoe',
//   },
//   {
//     name: 'Mary Jane',
//     job_title: 'Creative Director',
//     mobile: '+1233333333',
//     email: 'mary.jane@drtech.com',
//     qr_link: 'https://www.drtech.com/maryjane',
//   },
//   {
//     name: 'Walter White',
//     job_title: 'Sales Director',
//     mobile: '+1234444444',
//     email: 'walter.white@drtech.com',
//     qr_link: 'https://www.drtech.com/walterwhite',
//   },
// ];

(async () => {
  const data = [];

  fs.createReadStream('./staff_list.csv')
    .pipe(
      parse({
        delimiter: ',',
        columns: true,
        ltrim: true,
      })
    )
    .on('data', function (row) {
      data.push(row);
    })
    .on('error', function (error) {
      console.log(error.message);
    })
    .on('end', function () {
      console.log('parsed csv data:');
      console.log(data);
      generateImage(data);
    });
})();

function generateImage(staffs) {
  staffs.forEach(async (staff) => {
    const images = await bb.create_image(
      "your_template_id",
      {
        modifications: [
          {
            name: 'name',
            text: staff.name,
          },
          {
            name: 'job_title',
            text: staff.job_title,
          },
          {
            name: 'mobile',
            text: staff.mobile,
          },
          {
            name: 'email',
            text: staff.email,
          },
          {
            name: 'qr_code',
            target: staff.qr_link,
          },
        ],
      },
      true
    );

    console.log(images.image_url);
  });
}
