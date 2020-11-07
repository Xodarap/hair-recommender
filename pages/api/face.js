import { URLSearchParams } from 'url';

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async (req, res) => {
    var urlencoded = new URLSearchParams();
    urlencoded.append("image_base64", req.body.image_base64)
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const url = 'https://api-us.faceplusplus.com/facepp/v1/face/thousandlandmark?api_key=' +
    process.env.FACE_KEY +
    '&api_secret=' +
    process.env.FACE_SECRET +
    '&return_landmark=all'
    const r = await fetch(url,
      {
        headers: myHeaders,
        method: 'POST',
        body: urlencoded,
        redirect: 'follow'
      }
      ).then(r => r.json())  
    res.send(r)
    res.end();
};