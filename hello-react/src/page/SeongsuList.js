import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {Link, useLocation, useNavigate} from 'react-router-dom';

const PlaceList  = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // 페이지당 보여줄 음식점 수
  const maxPageNumbers = 10; // 페이징 숫자 최대 갯수
  const mapElement = useRef(null);
  const restaurantList = useRef(null);
  const { naver } = window;
  const item = useLocation().state;


  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(37.5443, 127.0455), // 성수동의 좌표
      zoom: 14,
    };
    const map = new naver.maps.Map(mapElement.current, mapOptions);


    // API 호출 함수 정의
    const fetchData = async (page) => {
      try {
        var params = {curPage:page,itemsPerPage:itemsPerPage}
        const response = await axios.post(`http://localhost:8080/getPlaceList`, params);
        const { data, totalCount } = response.data;
        setRestaurants(data);
        console.log('아아아',data);

        data.forEach((item, index) => {
          naver.maps.Service.geocode({
            query: item.old_addr
          }, function (status, response) {
            if (status !== naver.maps.Service.Status.OK) {
              return alert('Something wrong!');
            }

            const result = response.v2.addresses[0];
            console.log(`Geocoded result for address ${index + 1}:`, result);

            let location = naver.maps.LatLng(result);

            let marker = new naver.maps.Marker({
                position: location,
                map:map
            });
            let contentString = `
                <div>
                  <h4>${item.name}</h4>
                  <p>${item.old_addr}</p>
                  <p>${item.phone}</p> 
                </div>
              `;

            let infoWindow = new naver.maps.InfoWindow({
              content: contentString,
              maxWidth: 200, // 최대 너비 설정 (선택 사항)
              backgroundColor: "#eee", // 배경색 설정 (선택 사항)
              borderColor: "#2db400", // 테두리 색 설정 (선택 사항)
              borderWidth: 5, // 테두리 두께 설정 (선택 사항)
              anchorSize: new naver.maps.Size(30, 30), // 앵커 크기 설정 (선택 사항)
              anchorSkew: true, // 앵커 비스듬히 설정 (선택 사항)
              anchorColor: "#000", // 앵커 색 설정 (선택 사항)
              pixelOffset: new naver.maps.Point(20, -20) // 픽셀 단위로 오버레이 창 위치 조정 (선택 사항)
            });

            naver.maps.Event.addListener(marker, 'click', function() {
              if (infoWindow.getMap()) {
                infoWindow.close();
              } else {
                infoWindow.open(map, marker);
              }
            });
          });
        });


        // 전체 페이지 계산
        // const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage);
        // setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    // 페이지가 변경될 때마다 API 호출
    fetchData(currentPage);
  }, [currentPage]);



  // const navigate = useNavigate();
  // // 포토존 이미지 클릭시 상세 페이지로 이동
  // const handleDetailPost = ({ restaurant }) => {
  //   navigate('/Detail', {
  //     state: {
  //       storeAddr: `${restaurant.old_addr}`,
  //       storeName: `${restaurant.name}`,
  //       storeCategory: `${restaurant.category_nm}`,
  //       storeHistory: `${restaurant.update_date}`,
  //       beforePage: currentPage
  //     },
  //   });
  // };

  return (
      <>
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">음식점 상세보기</h6>
        </div>
        <div className="card-body">
          <div ref={mapElement} style={{ minHeight: '600px', position: 'relative' }}>
            {/* 맛집 리스트를 표시할 요소. 지도 위에 오버레이 형태로 배치 */}
            <div>
              <ul>
                {restaurants.map((restaurant, index) => (
                    <li key={index} onClick={() => setRestaurants(restaurant)}>
                      {restaurant.name}
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      </>
  );
};

export default PlaceList;