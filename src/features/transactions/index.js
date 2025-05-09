import { useEffect, useState } from "react";
import moment from "moment";
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import TitleCard from "../../components/Cards/TitleCard";
import SearchBar from "../../components/Input/SearchBar";
import AddContactForm from "./AddContactForm";
import EditContactForm from "./EditContactForm";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";

const TopSideButtons = ({ removeFilter, applyFilter, applySearch, categoryFilters, countryFilters }) => {
    const [filterParam, setFilterParam] = useState({ category: "", country: "" });
    const [searchText, setSearchText] = useState("");

    const showFiltersAndApply = (param, type) => {
        const updatedParams = { ...filterParam, [type]: param };
        applyFilter(updatedParams, searchText);
        setFilterParam(updatedParams);
    };

    const removeAppliedFilter = () => {
        removeFilter();
        setFilterParam({ category: "", country: "" });
        setSearchText("");
    };

    useEffect(() => {
        if (searchText === "") {
            removeAppliedFilter();
        } else {
            applySearch(searchText);
        }
    }, [searchText]);

    return (
        <div className="inline-block float-right space-x-2">
            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText} />
            {(filterParam.category || filterParam.country) && (
                <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">
                    {filterParam.category && filterParam.category} {filterParam.country && filterParam.country}
                    <XMarkIcon className="w-4 ml-2" />
                </button>
            )}
            <div className="dropdown dropdown-bottom dropdown-end z-10">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                    <FunnelIcon className="w-5 mr-2" /> Filter
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {categoryFilters.map((category, index) => (
                        <li key={index}>
                            <a onClick={() => showFiltersAndApply(category, 'category')}>{category}</a>
                        </li>
                    ))}
                    <div className="divider mt-0 mb-0"></div>
                    {countryFilters.map((country, index) => (
                        <li key={index}>
                            <a onClick={() => showFiltersAndApply(country, 'country')}>{country}</a>
                        </li>
                    ))}
                    <div className="divider mt-0 mb-0"></div>
                    <li>
                        <a onClick={() => removeAppliedFilter()}>Remove Filter</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1); 
    const [filterParam, setFilterParam] = useState({ category: "", country: "" });
    const [searchText, setSearchText] = useState("");
    const dispatch = useDispatch();
    const [pageSize,setPageSize] = useState(2);
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:8083/api/contact/category");
                const data = await response.json();
                setCategories(data.map(categoryObj => categoryObj.category));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchCountries = async () => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                const data = await response.json();
                setCountries(data.map(country => country.name.common));
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCategories();
        fetchCountries();
        fetchContacts();
    }, []);

    const applyFilter = (params, searchText) => {
        setFilterParam(params); // Store the applied filters in state
        setSearchText(searchText); // Store the search text
        setCurrentPage(1); // Reset to first page when applying filters
        fetchContacts(params.category, params.country, searchText, 1);
    };
    
    const applySearch = (searchText) => {
        setSearchText(searchText); // Store the search text in state
        setCurrentPage(1); // Reset to first page when applying search
        fetchContacts(filterParam.category, filterParam.country, searchText, 1);
    };
    
    
    const removeFilter = () => {
        setFilterParam({ category: "", country: "" }); // Reset filters in state
        setSearchText(""); // Reset search text in state
        setCurrentPage(1); // Reset to first page when removing filters
        fetchContacts();
    };
    
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchContacts(filterParam.category, filterParam.country, searchText, newPage);
    };

    
    
    const fetchContacts = async (category = null, country = null, supplierName = "", page = 1, pageSize = 5) => {
        try {
            let url = `${process.env.REACT_APP_NODE_API_SERVER}contact/contacts?page=${page}&pageSize=${pageSize}`;
    
            // Construct query parameters based on filters and search text
            if (category || country || supplierName) {
                url += `&`;
                if (category) url += `category=${category}`;
                if (country) url += `${category ? '&' : ''}country=${country}`;
                if (supplierName) url += `${(category || country) ? '&' : ''}supplierName=${encodeURIComponent(supplierName)}`;
            }
    
            console.log('Fetch URL:', url); // Debugging URL
    
            const response = await fetch(url);
            const data = await response.json();
    
            setContacts(data.data); // Set contacts from the response
            setTotalPages(data.pagination.totalPages); // Set total pages from response
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };
    
    
    const addContact = async (contactData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_NODE_API_SERVER}contact/contacts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contactData),
            });

            if (response.ok) {
                fetchContacts(); 
                document.getElementById('add_contacts').close(); 
                dispatch(showNotification({ message: "Added Contact Into Database", status: 1 }));
            } else {
                console.error("Error adding contact:", response.statusText);
                dispatch(showNotification({ message: "Error Adding Contacts", status: 0 }));
                document.getElementById('add_contacts').close(); 
            }
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    const updateContact = async (contactData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_NODE_API_SERVER}contact/contacts/${contactData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contactData),
            });

            if (response.ok) {
                fetchContacts(); 
                document.getElementById('edit_contacts').close(); 
                dispatch(showNotification({ message: "Updated Contact Into Database", status: 1 }));
            } else {
                console.error("Error updating contact:", response.statusText);
                dispatch(showNotification({ message: "Error Updating Contacts", status: 0 }));
                document.getElementById('edit_contacts').close(); 
            }
        } catch (error) {
            console.error("Error updating contact:", error);
        }
    };

    const handleEditClick = (contact) => {
        setSelectedContact(contact); // Set the selected contact to be edited
        document.getElementById('edit_contacts').showModal(); // Show the edit modal
    };

    return (
        
        <>
        
            <TitleCard title="Contact Database" topMargin="mt-2" TopSideButtons={
                <TopSideButtons 
                    applySearch={applySearch} 
                    applyFilter={applyFilter} 
                    removeFilter={removeFilter} 
                    categoryFilters={categories} 
                    countryFilters={countries} 
                />
            }>
                <button className="btn btn-sm" onClick={() => document.getElementById('add_contacts').showModal()}>Add Contacts</button>

                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Supplier Email</th>
                                <th>Category</th>
                                <th>Website</th>
                                <th>Country</th>
                                <th>Contact No 1</th>
                                <th>Contact No 2</th>
                                <th>Remark 1</th>
                                <th>Remark 2</th>
                                <th>Remark 3</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                       
                        <tbody>
                            {contacts.map((contact) => (
                                <tr key={contact.id}>
                                    <td>{contact.supplierName}</td>
                                    <td>{contact.supplierEmail}</td>
                                    <td>{contact.category}</td>
                                    <td>
                                        <a href={contact.supplierWebsite} target="_blank" rel="noopener noreferrer">
                                            {contact.supplierWebsite}
                                        </a>
                                    </td>
                                    <td>{contact.country}</td>
                                    <td>{contact.contactNo1}</td>
                                    <td>{contact.contactNo2}</td>
                                    <td>{contact.remark1}</td>
                                    <td>{contact.remark2}</td>
                                    <td>{contact.remark3}</td>
                                    <td>{moment(contact.createdAt).format("D MMM YYYY")}</td>
                                    <td className="space-y-2">
                                        <div className="btn btn-xs" onClick={() => handleEditClick(contact)}>Edit</div>
                                        <div className="btn btn-xs">Delete</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="join">
                    <button className="join-item btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>«</button>
                    <button className="join-item btn">Page {currentPage}/{totalPages}</button>
                    <button className="join-item btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>»</button>
                </div>

                <dialog id="add_contacts" className="modal">
                    <AddContactForm 
                        countries={countries} 
                        onSubmit={addContact} 
                        onClose={() => document.getElementById('add_contacts').close()} 
                    />
                </dialog>
                <dialog id="edit_contacts" className="modal">
                    {selectedContact && (
                        <EditContactForm 
                            contact={selectedContact} 
                            countries={countries} 
                            onSubmit={updateContact} 
                            onClose={() => document.getElementById('edit_contacts').close()} 
                        />
                    )}
                </dialog>
            </TitleCard>
        </>
    );
}

export default Contacts;
