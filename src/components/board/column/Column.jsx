import { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from 'utils/firebase/firebase';
import Button from '../../ui/button/Button';
import TaskCard from '../task_card/TaskCard';
import styles from './Column.module.css';

const Column = ({ column, columns, addTask, moveTask, onAddColumn }) => {
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snapshotError, setSnapshotError] = useState(null);
  const [hoverSide, setHoverSide] = useState(null);

  const textareaRef = useRef(null);

  // Автоматичне збільшення висоти textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newTaskText]);

  // Сортування завдань
  const sortedTasks = useMemo(() => 
    [...tasks].sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt;
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt;
      return aTime - bTime;
    }), 
    [tasks]
  );

  // Підписка на завдання колонки
  useEffect(() => {
    const q = query(
      collection(db, 'tasks'),
      where('columnId', '==', column.id)
    );
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksData);
        setSnapshotError(null);
      },
      (error) => {
        console.error('Помилка отримання завдань:', error);
        setSnapshotError('Не вдалося завантажити завдання');
      }
    );

    return () => unsubscribe();
  }, [column.id]);

  // Додавання нового завдання
  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;
    
    setIsLoading(true);
    try {
      await addTask(column.id, newTaskText);
      setNewTaskText('');
      setIsAddingTask(false);
    } catch (error) {
      console.error('Помилка додавання:', error);
      alert(`Помилка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Hover для кнопок додавання колонки
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverSide(x < rect.width / 2 ? 'left' : 'right');
  };
  const handleMouseLeave = () => setHoverSide(null);

  return (
    <div className={styles.column} onMouseDown={(e) => e.preventDefault()}>
      <div 
        className={styles.columnHeader}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
      >
        {hoverSide === 'left' && (
          <button 
            className={styles.addColumnBtn}
            onClick={() => onAddColumn(column.id, 'before')}
          >+</button>
        )}

        <h3 style={{ margin: '0 8px', flexGrow: 1 }}>{column.title}</h3>

        {hoverSide === 'right' && (
          <button
            className={styles.addColumnBtn}
            onClick={() => onAddColumn(column.id, 'after')}
          >+</button>
        )}
      </div>

      {snapshotError && <div className={styles.error}>{snapshotError}</div>}

      <div className={styles.tasks} onMouseDown={(e) => e.preventDefault()}>
        {sortedTasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            columns={columns} 
            moveTask={moveTask}
          />
        ))}
      </div>

      {isAddingTask ? (
        <div className={styles.addForm}>
          <textarea
            ref={textareaRef}
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Введіть текст завдання"
            className={styles.textarea}
            rows={1}
            autoFocus
          />
          <div className={styles.buttons}>
            <Button
              onClick={handleAddTask}
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >Додати</Button>
            <Button
              onClick={() => setIsAddingTask(false)}
              variant="secondary"
              disabled={isLoading}
            >Скасувати</Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingTask(true)}
          variant="secondary"
        >+ Додати завдання</Button>
      )}
    </div>
  );
};

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  addTask: PropTypes.func.isRequired,
  moveTask: PropTypes.func.isRequired,
  onAddColumn: PropTypes.func.isRequired,
};

export default Column;
