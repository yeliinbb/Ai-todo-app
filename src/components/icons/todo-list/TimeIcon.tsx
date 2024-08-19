import { cn } from "@/shared/utils";
import { HTMLAttributes } from "react";

const TimeIcon = ({ className, ...rest }: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
      {...rest}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.4487 1.84097C6.25753 1.50593 7.12444 1.3335 7.99992 1.3335C8.8754 1.3335 9.7423 1.50593 10.5511 1.84097C11.36 2.176 12.0949 2.66706 12.714 3.28612C13.333 3.90517 13.8241 4.6401 14.1591 5.44894C14.4941 6.25778 14.6666 7.12468 14.6666 8.00016C14.6666 8.87564 14.4941 9.74255 14.1591 10.5514C13.8241 11.3602 13.333 12.0952 12.714 12.7142C12.0949 13.3333 11.36 13.8243 10.5511 14.1594C9.7423 14.4944 8.8754 14.6668 7.99992 14.6668C7.12444 14.6668 6.25753 14.4944 5.4487 14.1594C4.63986 13.8243 3.90493 13.3333 3.28587 12.7142C2.66682 12.0952 2.17575 11.3602 1.84072 10.5514C1.50569 9.74255 1.33325 8.87564 1.33325 8.00016C1.33325 7.12468 1.50569 6.25778 1.84072 5.44894C2.17575 4.6401 2.66682 3.90517 3.28587 3.28612C3.90493 2.66706 4.63986 2.176 5.4487 1.84097ZM7.99992 2.66683C7.29954 2.66683 6.60601 2.80478 5.95894 3.07281C5.31187 3.34083 4.72393 3.73368 4.22868 4.22893C3.73344 4.72417 3.34059 5.31211 3.07256 5.95918C2.80454 6.60625 2.66659 7.29978 2.66659 8.00016C2.66659 8.70055 2.80454 9.39407 3.07256 10.0411C3.34059 10.6882 3.73344 11.2762 4.22868 11.7714C4.72393 12.2666 5.31187 12.6595 5.95894 12.9275C6.60601 13.1955 7.29954 13.3335 7.99992 13.3335C8.7003 13.3335 9.39383 13.1955 10.0409 12.9275C10.688 12.6595 11.2759 12.2666 11.7712 11.7714C12.2664 11.2762 12.6593 10.6882 12.9273 10.0411C13.1953 9.39407 13.3333 8.70055 13.3333 8.00016C13.3333 7.29978 13.1953 6.60625 12.9273 5.95918C12.6593 5.31212 12.2664 4.72417 11.7712 4.22893C11.2759 3.73368 10.688 3.34083 10.0409 3.07281C9.39383 2.80478 8.7003 2.66683 7.99992 2.66683ZM8.66659 7.3335V4.66683C8.66659 4.29864 8.36811 4.00016 7.99992 4.00016C7.63173 4.00016 7.33325 4.29864 7.33325 4.66683V8.00016C7.33325 8.36835 7.60459 8.66683 7.93931 8.66683H7.99992H10.0605C10.3952 8.66683 10.6666 8.36835 10.6666 8.00016C10.6666 7.63197 10.3952 7.3335 10.0605 7.3335H8.66659Z"
        fill="white"
      />
    </svg>
  );
};

export default TimeIcon;
