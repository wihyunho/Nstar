import React from 'react';
import { Link } from 'react-router-dom';

function Header(props) {
    return (
		<>
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                <div class="sidebar-brand-icon rotate-n-15">
                    <i class="fas fa-laugh-wink"></i>
                </div>
                <div class="sidebar-brand-text mx-3">성수동<sup>food</sup></div>
            </a>
            <hr class="sidebar-divider my-0" />

            <li class="nav-item">
                <a class="nav-link" href="List">
                    <i class="fas fa-fw fa-table"></i>
                    <span>음식 목록</span>
                </a>
            </li>
            <hr class="sidebar-divider d-none d-md-block" />
            <li class="nav-item">
                <a class="nav-link" href="DBList">
                    <i class="fas fa-fw fa-table"></i>
                    <span>음식 목록(DB)</span>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="SeongsuList">
                    <i className="fas fa-fw fa-table"></i>
                    <span>성수 맛집 목록</span>
                </a>
            </li>
            <hr class="sidebar-divider d-none d-md-block" />

        </ul>
		</>
    );
}

export default Header;