import React from 'react';
import { Link } from 'react-router-dom';

function Header(props) {
    return (
		<>
        <footer class="sticky-footer bg-white">
            <div class="container my-auto">
                <div class="copyright text-center my-auto">
                    <span>Copyright &copy; Your Website 2024</span>
                </div>
            </div>
        </footer>
		</>
    );
}

export default Header;