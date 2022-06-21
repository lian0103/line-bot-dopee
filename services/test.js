const moment = require('moment');
const { getActivitiesByDistrict } = require('./tourActivity');

getActivitiesByDistrict().then((res) => {
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
        ${actItem.Description}; ${actItem.WebsiteUrl ? actItem.WebsiteUrl : ''}`;
        replyStr += `
  `;
        replyArr.push({
          type: 'text',
          text: replyStr,
        });
        if (Object.keys(actItem.Picture).length > 0) {
          Object.keys(actItem.Picture).forEach((i, idx) => {
            let index = idx + 1;
  
            if (actItem.Picture['PictureUrl' + index]) {
              replyArr.push({
                type: 'image',
                originalContentUrl: actItem.Picture['PictureUrl' + index],
                previewImageUrl: actItem.Picture['PictureUrl' + index],
              });
            }
          });
        }
      }
    }
    console.log(replyStr);
    console.log(replyArr);
  });