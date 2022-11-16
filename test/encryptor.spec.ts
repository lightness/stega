import * as Jimp from "jimp";
import { Encryptor } from "../src/encryptor";

const encryptor = new Encryptor();

async function encrypt(srcImagePath: string, destImagePath: string, secret: string, depth: number) {
  const srcImage = await Jimp.read(srcImagePath);

  const destImage = encryptor.encrypt(srcImage, secret, depth);

  await destImage.writeAsync(destImagePath);
}

async function decrypt(destImagePath: string): Promise<string> {
  const destImage = await Jimp.read(destImagePath);
  const secret = encryptor.decrypt(destImage);

  return secret;
}

const pngSrcPath = './images/generated.png';
const jpgSrcPath = './images/Chrome.jpg';
const bmpSrcPath = './images/sample.bmp';
const pngDestPath = `./images/png-${Date.now()}.png`;
const jpgDestPath = `./images/jpg-${Date.now()}.jpg`;
const bmpDestPath = `./images/bmp-${Date.now()}.bmp`;
const secret = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin dictum urna, in eleifend est. Mauris sollicitudin eros eget sagittis aliquet. Nunc feugiat, felis vel dictum rhoncus, leo ligula bibendum risus, at vestibulum ipsum erat sed odio. Nulla facilisi. Duis pellentesque sapien dui. Pellentesque tortor mauris, ullamcorper ac ligula in, pulvinar ultrices ligula. Nam convallis quam luctus nulla sodales interdum. Praesent maximus lectus diam, scelerisque ullamcorper odio ornare eget. Duis lacinia massa quam, id laoreet massa faucibus bibendum. Nullam nec nibh diam. Nulla porta imperdiet lectus a luctus. Etiam pellentesque viverra urna eget egestas.

Aenean euismod augue odio, eget pretium tortor rhoncus in. Mauris vitae erat ullamcorper tellus laoreet vestibulum. Vestibulum mollis luctus eleifend. Sed suscipit non felis sed sagittis. Mauris ac volutpat neque, a varius diam. Proin accumsan nunc lorem, id viverra magna ultricies eu. Duis aliquet vel tortor id sodales. Sed iaculis enim quis dolor tincidunt egestas. Morbi sit amet sagittis dolor. Quisque accumsan, purus vitae varius pretium, justo ex tristique est, eget tincidunt mi elit eu enim. Sed rutrum mi eget vulputate cursus. Vivamus ultricies tortor eu egestas blandit. Morbi quis augue malesuada, facilisis orci vel, commodo velit. Vestibulum feugiat vulputate felis, ut porttitor enim viverra sed. Cras tempus, turpis ac accumsan egestas, leo ante tempor sapien, at vestibulum augue ante at libero. Sed vestibulum mattis sem, tristique dapibus justo pulvinar ac.

Donec pulvinar libero et lorem malesuada pellentesque ut et tellus. Proin in bibendum leo. Vivamus iaculis placerat molestie. Pellentesque aliquet diam vitae nisl consequat sagittis. Aenean viverra nulla non sem imperdiet ornare. Nulla sit amet odio vel metus molestie venenatis. Maecenas et auctor purus. Curabitur auctor nunc ac nibh aliquet sodales. Nunc gravida, diam id efficitur fringilla, est leo maximus nunc, et lobortis velit sapien eget leo. Aenean convallis, velit sollicitudin pretium finibus, nisl eros aliquam eros, efficitur tristique leo magna et velit. Etiam tempus finibus venenatis. Integer id diam enim. Pellentesque ut rhoncus magna.

Nunc eu magna vel massa tristique commodo. Ut condimentum arcu nec scelerisque tempor. Nulla interdum nisi efficitur, dapibus erat tristique, fringilla felis. Morbi porttitor porta tellus, a finibus lorem interdum eget. Suspendisse euismod egestas magna sed euismod. Suspendisse in ex mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget rutrum augue. Nullam sit amet convallis diam. Donec consequat malesuada tempus. Aliquam finibus congue sollicitudin.

Ut quis mi leo. Quisque consequat libero ac leo faucibus molestie. Nullam eget laoreet quam. Nam blandit massa vel ex efficitur, nec ornare lorem luctus. Etiam dignissim viverra rutrum. Aliquam et porttitor ligula. Curabitur ut pulvinar sem. Vestibulum dictum nulla ac ipsum volutpat ornare. Sed scelerisque orci massa, quis tincidunt diam ultricies id. Curabitur nisl risus, pharetra egestas pretium quis, volutpat vel tellus. Donec vulputate sem mauris, eget elementum felis commodo quis. Donec vestibulum, odio nec faucibus congue, elit massa tempus tortor, a tincidunt sem est quis odio. Nunc sagittis elementum leo, id lobortis nunc interdum eget. Fusce eget fermentum lacus, quis consequat nisi.
`;

encrypt(pngSrcPath, pngDestPath, secret, 5)
  .then(() => decrypt(pngDestPath))
  .then((decrypted) => {
    console.log(`PNG: ${decrypted === secret ? 'ok' : 'fail'}`);
  });

encrypt(bmpSrcPath, bmpDestPath, secret, 5)
  .then(() => decrypt(bmpDestPath))
  .then((decrypted) => {
    console.log(`BMP: ${decrypted === secret ? 'ok' : 'fail'}`);
  });

// encrypt(jpgSrcPath, jpgDestPath, secret, 5)
//   .then(() => decrypt(jpgDestPath))
//   .then((decrypted) => {
//     console.log(`JPG: ${decrypted === secret ? 'ok' : 'fail'}`);
//   });