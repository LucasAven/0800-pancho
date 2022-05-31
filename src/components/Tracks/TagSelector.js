import { getDatabase, onValue, ref } from "firebase/database";
import { useState, useEffect } from "react";
import { firebaseApp } from "utils/firebase";
import styled from "@emotion/styled";
import Select from "react-dropdown-select";

const db = getDatabase(firebaseApp);

const TagSelector = ({ onSort }) => {
  const [tags, setTags] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    onValue(
      ref(db, "tags/"),
      (snapshot) => {
        const fullTags = { All: "All", ...snapshot.val() };
        const formatedTags = [];
        Object.keys(fullTags).map((key) => formatedTags.push({ genre: key }));
        setTags(formatedTags);
        setLoading(false);
      },
      {
        onlyOnce: true,
      }
    );
  }, []);

  return (
    <StyledSelect
      options={tags}
      values={[]}
      color="#eee"
      dropdownGap={0}
      placeholder="Elije un tag"
      noDataLabel="Tag no encontrado"
      labelField="genre"
      valueField="genre"
      searchable={false}
      loading={loading}
      disabled={loading}
      onChange={(value) => onSort(value[0].genre)}
    />
  );
};

const StyledSelect = styled(Select)`
  background: #b38325;
  border: none;
  width: clamp(80px, 100%, 250px);
  border-radius: 9999px;
  padding: 2px 20px;

  :focus,
  :focus-within {
    box-shadow: 0px 0 0 2px rgb(238 238 14 / 20%);
  }
  .react-dropdown-select-content {
    flex-wrap: nowrap;
  }
  .react-dropdown-select-clear,
  .react-dropdown-select-dropdown-handle {
    color: #fff;
  }
  .react-dropdown-select-option {
    border: 1px solid #fff;
  }
  .react-dropdown-select-item {
    color: #eee;
  }
  .react-dropdown-select-input,
  .react-dropdown-select-input::placeholder {
    color: #eee;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 1px;
    width: 100%;
  }
  .react-dropdown-select-dropdown {
    position: absolute;
    top: 36px;
    left: 16px;
    border: none;
    width: 88%;
    padding: 0 0 5px;
    display: flex;
    flex-direction: column;
    border-radius: 2px 2px 20px 20px;
    max-height: 300px;
    overflow: auto;
    z-index: 9;
    background: #b38325;
    box-shadow: none;
  }
  .react-dropdown-select-item {
    border-bottom: transparent;

    :hover {
      color: #000;
      background: #ffff0045;
    }
  }
  .react-dropdown-select-item.react-dropdown-select-item-selected,
  .react-dropdown-select-item.react-dropdown-select-item-active {
    border-bottom: transparent;
    font-weight: bold;
    background: #ffb15d;
  }
  .react-dropdown-select-item.react-dropdown-select-item-disabled {
    background: #b38325;
    color: #ccc;
  }
`;

export default TagSelector;
