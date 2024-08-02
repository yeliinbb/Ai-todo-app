// import { Button } from "@/shared/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger
// } from "@/shared/ui/drawer";
// import { Input } from "@/shared/ui/input";
// import { Textarea } from "@/shared/ui/textarea";
// import { useState } from "react";
// import DatePicker from "react-datepicker";

// const AddTodoModal = () => {
//   const [startDate, setStartDate] = useState<Date>(new Date());

//   const handleColor = (time: Date) => {
//     return time.getHours() > 12 ? "text-success" : "text-error";
//   };
//   return (
//     <Drawer open={false}>
//       <DrawerTrigger>Open</DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader>
//           <Input type="text" placeholder="할 일을 입력해주세요." />
//           <Textarea placeholder="설명을 입력해주세요." />
//         </DrawerHeader>
//         <DrawerFooter>
//           <DatePicker
//             showTimeSelect
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             timeClassName={handleColor}
//           />
//           <Button>Submit</Button>
//           <DrawerClose></DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default AddTodoModal;
