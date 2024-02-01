import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Main from './page/Main';
import NotFound from './page/NotFound';
import ListPage from './page/BoardList';
import DetailPage from './page/BoardDetail';
import DBListPage from './page/DBList';

const App = () => {
	return (
		<div id="wrapper">
			<BrowserRouter>
			<Sidebar />
				<div id="content-wrapper" class="d-flex flex-column">
					<div id="content">
					<Navbar />
						<div class="container-fluid">
							<Routes>
								<Route path="/" element={<Main />}></Route>				
								<Route path="/List/*" element={<ListPage />}></Route>
								<Route path="/Detail" element={<DetailPage />}></Route>
								<Route path="/DBList" element={<DBListPage />}></Route>
								<Route path="*" element={<NotFound />}></Route>
							</Routes>
						</div>
					</div>
					<Footer />
			</div>
			</BrowserRouter>
		</div>
	);
};

export default App;