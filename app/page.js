import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className='text-black mt-10 mx-24 p-5'>
      <div className='flex justify-between mb-10 px-10'>
        <div className='pt-24'>
          <h1 className='text-5xl font-semibold p-2'>Got <span className='text-[#6300B3]'>Skills?</span></h1>
          <h2 className='text-4xl font-normal p-2'>Lets find you a job...</h2>
          <button className='rounded-full bg-[#6300B3] text-white font-semibold p-3 px-4 my-5 mx-2'><Link href='/signin?role=freelancer'>Sign Up as Job Seeker</Link></button>
        </div>
        <div className="img">
          <Image src='/home.png' width={300} height={210} alt='g' />
        </div>
      </div>

    

      <div className='flex justify-between mt-24 mb-20 px-10'>
        <div className="img">
          <Image src='/home-img2.jpg' width={400} height={310} alt='freelancer-img' />
        </div>
        <div className='pt-20'>
          <h1 className='text-5xl font-semibold p-2'>Have <span className='text-[#6300B3]'>Company...</span></h1>
          <h2 className='text-4xl font-normal p-2'>Lets get you right talent...</h2>
          <button className='rounded-full bg-[#6300B3] text-white font-semibold p-3 my-5 mx-2  transition-all duration-200'><Link href='/signin?role=client'>Sign Up as Recruiter</Link></button>
        </div>

      </div>


    </main>
    
  );
}
