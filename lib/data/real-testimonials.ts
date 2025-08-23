export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  avatar?: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
}

export const realTestimonials: Testimonial[] = [
  {
    id: '1',
    name: ';5:A0=4@ .',
    role: '>B>F8:;VAB 7 3-@VG=8< 4>A2V4><',
    location: '8W2',
    rating: 5,
    text: 'VA;O ?@>E>465==O :C@AC O ?>G02 2V4GC20B8 A515 =01030B> 2?52=5=VH5 =0 4>@>7V. A>1;82> :>@8A=8<8 1C;8 <>4C;V ?@> :5@C20==O 2 5:AB@5<0;L=8E A8BC0FVOE.',
    date: '2024-12-15',
    verified: true,
    beforeAfter: {
      before: '>O2AO W748B8 2 4>I',
      after: '?52=5=> :5@CN 2 1C4L-O:C ?>3>4C'
    }
  },
  {
    id: '2',
    name: '0@VO .',
    role: '>G0B:V25FL',
    location: 'L2V2',
    rating: 5,
    text: 'Nebachiv 4>?><V3 <5=V ?>4>;0B8 AB@0E ?5@54 <>B>F8:;><. "5?5@ O =5 ?@>AB> W646C - O @>7C<VN DV78:C :5@C20==O B0 <>6C ?5@5410G0B8 =5157?5G=V A8BC0FVW.',
    date: '2024-11-20',
    verified: true,
    beforeAfter: {
      before: '!B@0E H284:>ABV ?>=04 60 :</3>4',
      after: '><D>@B=0 W740 =0 B@0AV'
    }
  },
  {
    id: '3',
    name: 'VB0;V9 .',
    role: '>A2V4G5=89 @0945@',
    location: '%0@:V2',
    rating: 5,
    text: '0 10 @>:V2 =0 <>B>F8:;V 4C<02, I> 7=0N 2A5. C@A ?>:0702, A:V;L:8 ?><8;>: O @>182. "5?5@ <>O W740 AB0;0 =5 BV;L:8 157?5G=VH>N, 0;5 9 5:>=><=VH>N.',
    date: '2024-10-10',
    verified: true,
    beforeAfter: {
      before: '2 ?04V==O 70 @V:',
      after: '0 V=F845=BV2 70 8 <VAOFV2'
    }
  },
  {
    id: '4',
    name: '=4@V9 !.',
    role: '=AB@C:B>@ <>B>H:>;8',
    location: '45A0',
    rating: 5,
    text: '8:>@8AB>2CN <0B5@V0;8 Nebachiv 4;O =02G0==O A2>WE CG=V2. &5 =09:@0I0 A8AB5<0B870FVO 7=0=L ?@> 157?5G=5 2>4V==O, O:C O 10G82.',
    date: '2024-09-05',
    verified: true
  },
  {
    id: '5',
    name: '.;VO .',
    role: '>B>F8:;VAB:0-?>G0B:V25FL',
    location: '=V?@>',
    rating: 5,
    text: '@>9H;0 :C@A ?5@54 ?>:C?:>N ?5@H>3> <>B>F8:;0. &5 4>?><>3;> >1@0B8 ?@028;L=C <>45;L B0 C=8:=CB8 B8?>28E ?><8;>: =>20G:V2.',
    date: '2024-08-15',
    verified: true,
    beforeAfter: {
      before: '5 7=0;0 7 G>3> ?>G0B8',
      after: '?52=5=89 AB0@B 157 ?><8;>:'
    }
  }
];

export function getRandomTestimonials(count: number = 3): Testimonial[] {
  const shuffled = [...realTestimonials].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getTestimonialsByRating(minRating: number = 4): Testimonial[] {
  return realTestimonials.filter(t => t.rating >= minRating);
}

export function getVerifiedTestimonials(): Testimonial[] {
  return realTestimonials.filter(t => t.verified);
}