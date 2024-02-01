import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const BoardList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // 페이지당 보여줄 음식점 수111
  const maxPageNumbers = 10; // 페이징 숫자 최대 갯수


  useEffect(() => {
    // API 호출 함수 정의
    const fetchRestaurants = async (page) => {
      try {
        var params = {curPage:page,itemsPerPage:itemsPerPage}
        const response = await axios.post(`http://localhost:8080/getDBRestaurant`, params);
        const { data, totalCount } = response.data;

        setRestaurants(data);

        // 전체 페이지 계산
        const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    // 페이지가 변경될 때마다 API 호출
    fetchRestaurants(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li class={`paginate_button page-item ${currentPage === i ? 'active':''}`} key={i} onClick={() => handlePageChange(i)}>
          <a href="#" aria-controls="dataTable" data-dt-idx="1" class="page-link">{i}</a>
        </li>
      );
    }

    return pageNumbers;
  }; 

  const navigate = useNavigate();
  // 포토존 이미지 클릭시 상세 페이지로 이동
  const handleDetailPost = ({ restaurant }) => {
    navigate('/Detail', {
      state: {
        storeAddr: `${restaurant.addr}`,
        storeName: `${restaurant.name}`,
        storeCategory: `${restaurant.category}`,
        storeHistory: `${restaurant.start_date}`,
        beforePage: currentPage
      },
    });
  };

  return (
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">음식점 목록(DB)</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
            <thead>
              <tr>
                  <th>업소명</th>
                  <th>업태명</th>
                  <th>영업시작일</th>
                  <th>주소</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
              <tr onClick={() => handleDetailPost({restaurant})}>
                <td>{restaurant.name}</td>
                <td>{restaurant.category}</td>
                <td>{restaurant.start_date}</td>
                <td>{restaurant.addr}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-5">
            <div class="dataTables_info" id="dataTable_info" role="status" aria-live="polite">
              Showing {currentPage} of {totalPages} entries
            </div>
          </div>
          <div class="col-sm-12 col-md-7">
            <div class="dataTables_paginate paging_simple_numbers" id="dataTable_paginate">
              <ul class="pagination">

                <li class={`paginate_button page-item previous ${currentPage === 1 ? 'disabled':''}`} id="dataTable_previous" onClick={() => currentPage !=1 ? handlePageChange(currentPage - 1):null}>
                  <a href="#" aria-controls="dataTable" data-dt-idx="0" tabindex="0" class="page-link">Previous</a>
                </li>
                {renderPageNumbers()}
                <li class={`paginate_button page-item next ${currentPage === totalPages ? 'disabled':''}`} id="dataTable_next" onClick={() => currentPage !=totalPages ? handlePageChange(currentPage + 1):null}>
                  <a href="#" aria-controls="dataTable" data-dt-idx="7" tabindex="0" class="page-link">Next</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardList; 