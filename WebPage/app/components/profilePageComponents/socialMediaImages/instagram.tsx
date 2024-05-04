interface Props {
  iglink: string;
}
function InstagramImage({ iglink }: Props) {
  return (
    <a href={iglink} target="_blank" rel="noopener noreferrer">
      <svg
        fill="#000000"
        className="w-6 h-6 opacity-75 hover:opacity-100"
        viewBox="0 0 256 256"
        id="Flat"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M128,82a46,46,0,1,0,46,46A46.05239,46.05239,0,0,0,128,82Zm0,68a22,22,0,1,1,22-22A22.02489,22.02489,0,0,1,128,150ZM176,20H80A60.06812,60.06812,0,0,0,20,80v96a60.06812,60.06812,0,0,0,60,60h96a60.06812,60.06812,0,0,0,60-60V80A60.06812,60.06812,0,0,0,176,20Zm36,156a36.04061,36.04061,0,0,1-36,36H80a36.04061,36.04061,0,0,1-36-36V80A36.04061,36.04061,0,0,1,80,44h96a36.04061,36.04061,0,0,1,36,36ZM196,76a16,16,0,1,1-16-16A16.01833,16.01833,0,0,1,196,76Z" />
      </svg>
    </a>
  );
}

export default InstagramImage;
