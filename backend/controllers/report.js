const { Op, literal } = require('sequelize');
const Expenses = require('../models/expenses');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const Downloads = require('../models/downloads');

exports.monthlyList = async (req, res) => {
  try {
    const selectedMonth = req.body.selectedMonth;
    const [year, month] = selectedMonth.split('-');

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(year, month, 0);

    const totalRecords = await Expenses.count({
      where: {
        userId: req.user.id ,
        date: {
          [Op.between]: [startDate, endDate] // Filter by date range
        }
      }
    });

    //define pagination parameters
    const page = req.query.page || 1; //current page, default is 1
    const perPage = req.query.perPage || 10; //records per page

    const expensesForSelectedMonth = await Expenses.findAll({
      where: {
        userId: req.user.id ,
        date: {
          [Op.between]: [startDate, endDate] // Filter by date range
        }
      },
      order: [['date', 'ASC']],
      limit: Number(perPage),
      offset: (page - 1) * perPage
    });
    res.json({ expensesForSelectedMonth, totalRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'error while getting record' });
  }
};

async function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  });

  let params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    // access control level, making files publicly readable
    ACL: 'public-read'
  };
  // return new Promise((resolve, reject)=>{
  //   s3bucket.upload(params, (err, s3response) => {
  //   if (err) {
  //     console.log('something went wrong', err);
  //     reject(err)
  //   } else {
  //     resolve(s3response.Location)
  //   }
  // });
  // })
  try {
    const s3response = await s3bucket.upload(params).promise(); //when .promise() is used, a promise is returned
    return s3response.Location;
  } catch (error) {
    console.log('something went wrong', error);
    throw error;
  }
}

exports.downloadMonthlyList = async (req, res) => {
  try {
    const selectedMonth = req.body.selectedMonth;
    const [year, month] = selectedMonth.split('-');

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(year, month, 0);

    const expensesForSelectedMonth = await Expenses.findAll({
      where: {
        userId: req.user.id ,
        date: {
          [Op.between]: [startDate, endDate] // Filter by date range
        },
      },
      order: [['date', 'ASC']]
    });

    const stringifiedExpensesForSelectedMonth = JSON.stringify(
      expensesForSelectedMonth
    );
    //each download button click need to produce a new file name. otherwise same file will get overwritten, for different users also
    const filename = `Expenses/${selectedMonth}/${req.user.id}/${new Date()}.txt`;

    const fileUrl = await uploadToS3(
      stringifiedExpensesForSelectedMonth,
      filename
    );
    res.status(200).json({ fileUrl, success: true });
  } catch (error) {
    console.error(error);
    res.json({ fileUrl: '', success: false, error: error });
  }
};

exports.addToDownloads = async (req, res) => {
  try {
    const { fileUrl, selectedMonth, dateTime } = req.body;
    const newDownload = await Downloads.create({
      link : fileUrl,
      reportOfMonth : selectedMonth,
      dateTime : dateTime,
      userId : req.user.id
    });
    res.status(200).json(newDownload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'error in adding new download to model' });
  }
};

exports.listDownloads = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10; 

    const downloadsList = await Downloads.findAll({
      attributes : ['reportOfMonth', 'link', 'dateTime'],
      where: { userId: req.user.id }, 
      order : [['dateTime', 'DESC']],
      limit : Number(perPage),
      offset : (page-1)*perPage
    })
    res.status(200).json(downloadsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'error in getting downloads list'})
  }
};
