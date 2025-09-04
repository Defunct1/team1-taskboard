import React from "react";
import PropTypes from "prop-types";
import DeleteColumnButton from "../DeleteColumnButton/DeleteColumnButton";
import styles from "./ColumnHeader.module.css";

const ColumnHeader = ({ title, columnId, onDeleteColumn, dragHandleProps = {} }) => {
  return (
    <div className={styles.columnHeader} {...dragHandleProps}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.headerBtn} title={`Видалити колонку "${title}"`}>
        <DeleteColumnButton
          columnId={columnId}
          onDeleted={() => onDeleteColumn(columnId)}
          aria-label={`Видалити колонку ${title}`}
        />
      </div>
    </div>
  );
};

ColumnHeader.propTypes = {
  title: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  onDeleteColumn: PropTypes.func.isRequired,
  dragHandleProps: PropTypes.object,
};

export default ColumnHeader;
