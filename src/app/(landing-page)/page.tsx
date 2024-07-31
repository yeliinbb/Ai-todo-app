import React from "react";
import FixedActionButton from "./_components/FixedActionButton";

const LandingPage = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="overflow-y-auto h-full">
        {/* 모바일 화면 */}
        <div className="block desktop:hidden p-4 w-[calc(100%-32px)] mx-auto bg-gray-300">
          <h1>모바일</h1>
          <p>여기에 서비스의 기능 및 소개를 작성합니다. 모바일 화면용 콘텐츠입니다.</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur quod suscipit assumenda, quis id
            temporibus, necessitatibus quos nesciunt ipsam rerum, quo reiciendis recusandae illo eum delectus
            accusantium cupiditate! Similique, qui. <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim tenetur harum asperiores voluptates dolor quod
            quo modi debitis vero temporibus unde, veniam ullam nulla tempore officiis saepe fugit accusamus doloribus?{" "}
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, modi, tempora ratione non perspiciatis nemo
            harum animi iste consequuntur maxime sed officia voluptatem nostrum praesentium beatae? Illo quibusdam alias
            omnis. <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum incidunt ad laboriosam quis molestiae
            aspernatur quaerat quidem doloremque sint iure cupiditate aliquam, fugiat molestias, eveniet quas
            voluptatum, ullam in at.
            <br />
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae, asperiores ducimus. Sed obcaecati,
            quo, molestiae officiis hic iusto dolore eos ducimus consequuntur nemo voluptatum sequi minima optio,
            repellat corporis nostrum? <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima fugit explicabo nostrum hic perferendis
            saepe libero eligendi odit sunt, ullam distinctio, deserunt iste quasi consequuntur dolores corrupti fugiat
            velit consectetur. <br />
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis suscipit exercitationem, quod
            consequatur non aliquam ab ea maiores deserunt eveniet? Eaque at asperiores vero aut ratione fugiat quaerat
            dolore maxime.
            <br />
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae, asperiores ducimus. Sed obcaecati,
            quo, molestiae officiis hic iusto dolore eos ducimus consequuntur nemo voluptatum sequi minima optio,
            repellat corporis nostrum? <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima fugit explicabo nostrum hic perferendis
            saepe libero eligendi odit sunt, ullam distinctio, deserunt iste quasi consequuntur dolores corrupti fugiat
            velit consectetur. <br />
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis suscipit exercitationem, quod
            consequatur non aliquam ab ea maiores deserunt eveniet? Eaque at asperiores vero aut ratione fugiat quaerat
            dolore maxime.
            <br />
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae, asperiores ducimus. Sed obcaecati,
            quo, molestiae officiis hic iusto dolore eos ducimus consequuntur nemo voluptatum sequi minima optio,
            repellat corporis nostrum? <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima fugit explicabo nostrum hic perferendis
            saepe libero eligendi odit sunt, ullam distinctio, deserunt iste quasi consequuntur dolores corrupti fugiat
            velit consectetur. <br />
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis suscipit exercitationem, quod
            consequatur non aliquam ab ea maiores deserunt eveniet? Eaque at asperiores vero aut ratione fugiat quaerat
            dolore maxime.
            <br />
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae, asperiores ducimus. Sed obcaecati,
            quo, molestiae officiis hic iusto dolore eos ducimus consequuntur nemo voluptatum sequi minima optio,
            repellat corporis nostrum? <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima fugit explicabo nostrum hic perferendis
            saepe libero eligendi odit sunt, ullam distinctio, deserunt iste quasi consequuntur dolores corrupti fugiat
            velit consectetur. <br />
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis suscipit exercitationem, quod
            consequatur non aliquam ab ea maiores deserunt eveniet? Eaque at asperiores vero aut ratione fugiat quaerat
            dolore maxime.
            <br />
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae, asperiores ducimus. Sed obcaecati,
            quo, molestiae officiis hic iusto dolore eos ducimus consequuntur nemo voluptatum sequi minima optio,
            repellat corporis nostrum? <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima fugit explicabo nostrum hic perferendis
            saepe libero eligendi odit sunt, ullam distinctio, deserunt iste quasi consequuntur dolores corrupti fugiat
            velit consectetur. <br />
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis suscipit exercitationem, quod
            consequatur non aliquam ab ea maiores deserunt eveniet? Eaque at asperiores vero aut ratione fugiat quaerat
            dolore maxime.
            <br />
          </p>
        </div>
        {/* 데스크톱 화면 */}
        <div className="hidden desktop:block p-4 bg-gray-100">
          <h1>데스크탑</h1>
          <p>여기에 서비스의 기능 및 소개를 작성합니다. 데스크톱 화면용 콘텐츠입니다.</p>
        </div>
      </div>
      {/* 파이 바로가기 화면 아래에 고정 */}

      <FixedActionButton />
    </div>
  );
};

export default LandingPage;
