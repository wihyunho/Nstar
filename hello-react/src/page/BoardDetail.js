import { useEffect, useRef, useState} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const MapNaverDefault = () => {
  const mapElement = useRef(null);
  const { naver } = window;
  const item = useLocation().state;
  let xLocation;
  let yLocation;

  useEffect(() => {
    if (!mapElement.current || !naver) return;
    //주소명으로 x,y 좌표 구해오기
    if(item.storeAddr != 'null'){
      naver.maps.Service.geocode({
        query: item.storeAddr
      }, function(status, response) {
        if (status !== naver.maps.Service.Status.OK) {
            return alert('Something wrong!');
        }

        xLocation = response.v2.addresses[0].y;
        yLocation = response.v2.addresses[0].x;

        const location = new naver.maps.LatLng(xLocation, yLocation);
        const mapOptions = {
          center: location,
          zoom: 19,
          zoomControl: true,
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);
        new naver.maps.Marker({
          position: location,
          map,
        });
      });
    }
  }, []);

  return (
    <>
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">음식점 상세보기</h6>
        </div>
        <div class="card-body">
        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
          <tbody>
            <tr>
              <th>업소명</th>
              <th>{item.storeName}</th>
            </tr>
            <tr>
              <th>업태명</th>
              <th>{item.storeCategory}</th>
            </tr>
            <tr>
              <th>영업자시작일</th>
              <th>{item.storeHistory}</th>
            </tr>
            <tr>
              <th>주소</th>
              <th>{item.storeAddr}</th>
            </tr>
            {item.storeAddr != 'null'
            ?
            <tr>
              <th colspan='2'><div ref={mapElement} style={{ minHeight: '400px' }} /></th>
            </tr>
            :
            null
            }
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default MapNaverDefault;