export default function Footer() {
  return (
    <footer className="bg-[#B0B3A8] mt-10">
      <div className="flex justify-center flex-col text-[#F3ECE1] space-y-2 items-center py-8">
        <h2 className="font-bagel text-[40px] leading-[3rem]">REACH US</h2>
        <a href="mailto:hello@persqft.co" className="hover:underline text-sm font-opensans sm:text-base">
          hello@persqft.co
        </a>
        <a href="tel:+6582993907" className="hover:underline text-sm font-opensans sm:text-base">
          +65 8299 3907
        </a>
        <a href="https://maps.app.goo.gl/9j4MiCy1btCfodCp9" target='_blank'>
        <p className="text-sm sm:text-base font-opensans">
           16 Arumugam Road, LTC Building D #05-05
        </p>
          </a>
      </div>
      <div className="flex justify-center">
        <div className="py-[0.5px] w-[98vw] bg-[#F3ECE1]"></div>
      </div>
      <div className="flex justify-center text-[#F3ECE1] ">
        <div className="pt-4 pb-3 font-opensans gap-3 text-center text-sm sm:text-base w-[98vw]">
          <p>PERSQFT PTE LTD / UEN 202006224E</p>
        </div>
      </div>
    </footer>
  );
}
