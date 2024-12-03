import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FormBuilderPage = () => {
  const [formElements, setFormElements] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [savedForms, setSavedForms] = useState([]); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [recentForms, setRecentForms] = useState([]); 
  const [showSavedForms, setShowSavedForms] = useState(false); 
  const [showRecentForms, setShowRecentForms] = useState(false); 
  const [formTitle, setFormTitle] = useState(""); 
  const navigate = useNavigate();

  const inputs = [
    { label: "First Name", type: "text", placeholder: "Enter text" },
    { label: "Last Name", type: "text", placeholder: "Enter text" },
    { label: "Address", type: "text", placeholder: "Enter text" },
    { label: "Email", type: "email", placeholder: "Enter email" },
    { label: "Phone Number", type: "tel", placeholder: "Enter phone number" },
    { label: "Password", type: "password", placeholder: "Enter password" },
    { label: "Checkbox", type: "checkbox", placeholder: "Select checkbox" },
    { label: "Radio Button", type: "radio", placeholder: "Select an option" },
    {
      label: "Dropdown",
      type: "dropdown",
      options: ["Option 1", "Option 2", "Option 3"],
      placeholder: "Choose an option",
    },
    { label: "File Upload", type: "file", placeholder: "Upload a file" },
    { label: "Date Picker", type: "date", placeholder: "Select a date" },
    { label: "Range Slider", type: "range", placeholder: "Select range" },
    
  ];

  
  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem("savedForms"));
    if (storedForms) {
      setSavedForms(storedForms);
    }
  }, []);

  const onDragStart = (e, index) => {
    setDraggingIndex(index);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggingIndex === index) return;

    
    const updatedElements = [...formElements];
    const [draggedElement] = updatedElements.splice(draggingIndex, 1);
    updatedElements.splice(index, 0, draggedElement);
    setFormElements(updatedElements);
    setDraggingIndex(index);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDraggingIndex(null); 
  };

  const onSidebarDragStart = (e, input) => {
    e.dataTransfer.setData("input", JSON.stringify(input));
  };

  const onFormAreaDrop = (e) => {
    e.preventDefault();
    const input = JSON.parse(e.dataTransfer.getData("input"));
    setFormElements([...formElements, input]);
  };

  const handleCreate = () => {
    if (!formTitle.trim()) {
      alert("Please enter a title for the form.");
      return;
    }
    
    localStorage.setItem("formElements", JSON.stringify(formElements));
    localStorage.setItem("formTitle", formTitle); 
    const recentForm = { title: formTitle, form: formElements, timestamp: new Date().toLocaleString() };
    setRecentForms([recentForm, ...recentForms].slice(0, 5)); 
    setShowRecentForms(true); 
    setFormElements([]); 
    setFormTitle(""); 
    navigate("/preview");
  };

  const handleSaveForm = () => {
    if (!formTitle.trim()) {
      alert("Please enter a title for the form.");
      return;
    }
    if (editingIndex !== null) {
      const updatedSavedForms = [...savedForms];
      updatedSavedForms[editingIndex] = { title: formTitle, form: formElements };
      setSavedForms(updatedSavedForms);
      setEditingIndex(null);
    } else {
      const newSavedForms = [...savedForms, { title: formTitle, form: formElements }];
      setSavedForms(newSavedForms);
      localStorage.setItem("savedForms", JSON.stringify(newSavedForms));
    }
    setFormElements([]); 
    setFormTitle(""); 
  };

  const handleShowSavedForms = () => {
    setShowSavedForms(!showSavedForms);
    setShowRecentForms(false); 
  };

  const handleEditSavedForm = (index) => {
    const formToEdit = savedForms[index];
    setFormElements(formToEdit.form);
    setFormTitle(formToEdit.title); 
    setEditingIndex(index);
    setShowSavedForms(false);
  };

 

  const handleDeleteSavedForm = (index) => {
    const updatedSavedForms = savedForms.filter((_, i) => i !== index);
    setSavedForms(updatedSavedForms);
    localStorage.setItem("savedForms", JSON.stringify(updatedSavedForms));
  };

  const handleDelete = (index) => {
    const updatedElements = formElements.filter((_, i) => i !== index);
    setFormElements(updatedElements);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-200 flex items-center justify-center">
      <div className="flex bg-white shadow-lg rounded-lg w-4/5 max-w-5xl">
        <div className="bg-teal-100 w-1/4 p-4 rounded-l-lg">
          <h2 className="font-bold text-gray-700 mb-4 text-center">
            {showSavedForms ? "Saved Forms" : showRecentForms ? "Recent Forms" : "Form Elements"}
          </h2>
          {showRecentForms ? (
            <div>
              {recentForms.map((form, index) => (
                <div
                  key={index}
                  className="bg-white p-2 mb-3 shadow rounded hover:bg-teal-200 cursor-pointer"
                >
                  <div>{form.title || `Form ${index + 1}`}</div>
                  <div className="text-sm text-gray-500">Created On: {form.timestamp}</div>
                </div>
              ))}
            </div>
          ) : showSavedForms ? (
            <div>
              {savedForms.map((form, index) => (
                <div
                  key={index}
                  className="bg-white p-2 mb-3 shadow rounded hover:bg-teal-200 cursor-pointer relative"
                >
                  <div onClick={() => handleEditSavedForm(index)}>
                    {form.title || `Form ${index + 1}`}
                  </div>
                  <button
                    onClick={() => handleDeleteSavedForm(index)}
                    className="absolute top-2 right-2 text-red-500 font-bold"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-y-auto max-h-80">
              {inputs.map((input, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => onSidebarDragStart(e, input)}
                  className="bg-white p-2 mb-3 shadow rounded hover:bg-teal-200 cursor-pointer"
                >
                  {input.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className="flex-1 p-8 bg-slate-50 border-dashed border-4 border-indigo-300 rounded-lg mx-4"
          onDrop={onFormAreaDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{ height: "600px", width: "calc(100% - 20px)" }} 
        >
          <h1 className="text-lg font-bold text-gray-700 mb-4">
            Drag and Drop Your Form Elements Here
          </h1>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Enter form title"
            className="border border-gray-300 rounded w-full p-2 mb-4 focus:ring-2 focus:ring-indigo-300"
          />
          <div className="bg-white p-4 rounded shadow" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {formElements.map((element, index) => (
              <div
                key={index}
                className="mb-4 p-2 border rounded bg-gray-100 relative"
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDrop={onDrop}
              >
                <button
                  className="absolute top-2 right-2 text-red-500 font-bold"
                  onClick={() => handleDelete(index)}
                >
                  ❌
                </button>
                <label className="block font-medium text-gray-600 mb-1">{element.label}</label>
                {["text", "email", "number", "password", "tel"].includes(element.type) && (
                  <input
                    type={element.type}
                    placeholder={element.placeholder}
                    className="border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-indigo-300"
                    disabled
                  />
                )}
                {element.type === "checkbox" && (
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    disabled
                  />
                )}
                {element.type === "radio" && (
                  <input
                    type="radio"
                    className="form-radio"
                    disabled
                  />
                )}
                {element.type === "dropdown" && (
                  <select className="border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-indigo-300" disabled>
                    {element.options.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                )}
                {element.type === "file" && (
                  <input
                    type="file"
                    className="border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-indigo-300"
                    disabled
                  />
                )}
                {element.type === "date" && (
                  <input
                    type="date"
                    className="border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-indigo-300"
                    disabled
                  />
                )}
                {element.type === "time" && (
                  <input
                    type="time"
                    className="border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-indigo-300"
                    disabled
                  />
                )}
                {element.type === "range" && (
                  <input
                    type="range"
                    className="border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-indigo-300"
                    disabled
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 flex flex-col space-y-2">
          <button
            onClick={handleSaveForm}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-2 px-4 rounded shadow hover:bg-blue-600"
          >
            Save Form
          </button>
          <button
            onClick={handleShowSavedForms}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500  py-2 px-4 rounded shadow hover:bg-green-600"
          >
            {showSavedForms ? "Hide Saved Forms" : "Saved Forms"}
          </button>
          
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500  py-2 px-4 rounded shadow hover:bg-teal-600"
          >
          Preview Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;
