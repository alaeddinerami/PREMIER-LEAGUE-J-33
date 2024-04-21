export default function Logo() {
  return (
    <div className='flex items-center w-fit' to={"/"}>
      <img src='/logo.webp' className='mr-3 h-6 sm:h-9' alt='Anamcara Logo' />
      <span className='self-center whitespace-nowrap text-xl font-semibold'>
        Premier League
      </span>
    </div>
  );
}
