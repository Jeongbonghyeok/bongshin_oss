import React from "react";

const CategorySidebar = ({ categories, currentCategory, onCategoryClick }) => {
    return (
        <aside className="category-sidebar">
            <ul className="category-list">
                {categories.map((cat) => (
                    <li key={cat.name}>
                        <button
                            className={`category-btn ${currentCategory === cat.name ? "active" : ""}`}
                            onClick={() => onCategoryClick(cat)}
                        >
                            {cat.name}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default CategorySidebar;
