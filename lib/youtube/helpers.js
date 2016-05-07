// clean video data from youtube
const cleanVideo = ({ title, publishedAt, description, thumbnails }) => {

  // raw data where the video id can be found from the activity response... no kidding
  const thumbnail = thumbnails.default.url;

  // break it an array
  const splittedUrl =  thumbnail.split("/"); // url thumbnail is always like "https://i.ytimg.com/vi/{VIDEO_ID}/default.jpg"

  // we got it!
  const youtubeId = splittedUrl[4];

  return {
    title,
    publishedAt: Date.parse(publishedAt),
    description,
    thumbnail,
    youtubeId,
  };
};

export { cleanVideo };