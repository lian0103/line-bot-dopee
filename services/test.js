const moment = require('moment');
const { getActivitiesByDistrict } = require('./tourActivity');

getActivitiesByDistrict('台北').then((res) => {
  resultFilter = res.slice(0, 2);
  let replyArr = [];
  let replyStr = '';

  if (Array.isArray(resultFilter) && resultFilter.length > 0) {
    replyStr += `最近活動有:
  `;
    for (let i = 0; i < resultFilter.length; i++) {
      if (!resultFilter[i]) {
        console.log(resultFilter);
        return false;
      }

      let replyStr = '';
      let actItem = resultFilter[i];
      replyStr += `${actItem.ActivityName} 
        活動時間:${moment(actItem.StartTime).format('YYYY-MM-DD')}~${moment(
        actItem.EndTime
      ).format('YYYY-MM-DD')}
        ${actItem.Description}; ${
        actItem.WebsiteUrl ? actItem.WebsiteUrl : ''
      }`;
      replyStr += `
  `;
      replyArr.push({
        type: 'text',
        text: replyStr,
      });
      if (actItem.Picture.PictureUrl1) {
        replyArr.push({
          type: 'image',
          originalContentUrl: actItem.Picture.PictureUrl1,
          previewImageUrl: actItem.Picture.PictureUrl1,
        });
      }
    }
  }
  console.log(replyStr);
  console.log(replyArr);
});
