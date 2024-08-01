import { Dispatch, SetStateAction } from "react";

type PropsType = {
  hidePw: boolean;
  hidePwConfirm: boolean;
  setHidePw: Dispatch<SetStateAction<boolean>>;
  setHidePwConfirm: Dispatch<SetStateAction<boolean>>;
};

const Invisible = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.32495 2.67472C3.86934 2.2191 3.13065 2.2191 2.67504 2.67472C2.21943 3.13033 2.21943 3.86902 2.67504 4.32463L6.7386 8.3882C5.15559 9.6363 3.74725 11.32 2.49959 13.3995C2.27791 13.7689 2.27791 14.2305 2.49959 14.6C5.43843 19.498 9.26646 22.1649 13.9962 22.1664C15.8307 22.1778 17.6358 21.744 19.2585 20.9081L23.675 25.3246C24.1306 25.7802 24.8693 25.7802 25.325 25.3246C25.7806 24.869 25.7806 24.1303 25.325 23.6747L20.3697 18.7194C20.3162 18.6529 20.2565 18.5935 20.1919 18.5417L4.32495 2.67472ZM17.5025 19.1521L15.509 17.1586C15.0422 17.3817 14.5273 17.5007 14.0001 17.5008C13.0718 17.501 12.1815 17.1324 11.525 16.4761C10.8685 15.8198 10.4996 14.9296 10.4994 14.0014C10.4993 13.4737 10.6184 12.9584 10.8417 12.4913L8.40251 10.0521C7.15201 10.9883 5.97162 12.2929 4.87324 13.9998C7.45547 18.0143 10.5013 19.833 14 19.833H14.0077C15.2114 19.841 16.3991 19.6075 17.5025 19.1521ZM13.1383 14.7879C13.1501 14.8008 13.1622 14.8135 13.1746 14.8259C13.187 14.8382 13.1995 14.8502 13.2123 14.8619L13.1383 14.7879ZM13.997 8.16637C13.3627 8.16474 12.7298 8.22733 12.1081 8.35318C11.4766 8.48103 10.861 8.07272 10.7332 7.44119C10.6053 6.80967 11.0137 6.19408 11.6452 6.06624C12.4207 5.90923 13.2102 5.8311 14.0015 5.83304C18.7323 5.83361 22.5611 8.5006 25.5004 13.3995C25.7221 13.7689 25.7221 14.2305 25.5004 14.6C24.6871 15.9554 23.8058 17.1419 22.8535 18.1494C22.4109 18.6177 21.6725 18.6385 21.2043 18.1959C20.736 17.7533 20.7152 17.0149 21.1578 16.5466C21.8404 15.8245 22.4977 14.977 23.1267 13.9996C20.5445 9.98511 17.4986 8.16638 14 8.16638L13.997 8.16637Z"
        fill="#262627"
      />
    </svg>
  );
};

export default Invisible;
