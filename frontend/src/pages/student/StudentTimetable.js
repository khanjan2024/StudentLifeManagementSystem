import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimetables } from '../../redux/timetableRelated/timetableHandle';
import { 
    Box, CircularProgress, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Typography, styled 
} from '@mui/material';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledTimeCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    width: '100px',
}));

const ClassCell = styled(TableCell)(({ theme, type }) => ({
    backgroundColor: type === 'exam' ? theme.palette.error.light : theme.palette.success.light,
    padding: '8px',
    verticalAlign: 'top',
    height: '80px',
    border: `1px solid ${theme.palette.divider}`,
}));

const StudentTimetable = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { timetables, loading, error } = useSelector(state => state.timetable || {});
    const [timetableData, setTimetableData] = useState({});

    useEffect(() => {
        if (currentUser?.branch?._id) {
            dispatch(fetchTimetables({ branch: currentUser.branch._id }));
            console.log('Fetching timetables for branch:', currentUser.branch._id);
        } else {
            console.log('Student branch not found:', currentUser);
        }
    }, [dispatch, currentUser?.branch?._id]);

    // Process timetable data into a structured format for the table
    useEffect(() => {
        if (timetables && timetables.length > 0) {
            const processedData = {};
            
            // Initialize the data structure
            daysOfWeek.forEach(day => {
                processedData[day] = {};
                timeSlots.forEach(timeSlot => {
                    processedData[day][timeSlot] = [];
                });
            });
            
            // Fill in the timetable data
            timetables.forEach(entry => {
                const day = entry.day;
                const startTime = formatTime(entry.startTime);
                
                // Find the closest time slot
                const closestSlot = findClosestTimeSlot(startTime);
                
                if (processedData[day] && processedData[day][closestSlot]) {
                    processedData[day][closestSlot].push(entry);
                }
            });
            
            setTimetableData(processedData);
        }
    }, [timetables]);

    // Helper function to format time from 24-hour to 12-hour format
    const formatTime = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // Helper function to find the closest time slot
    const findClosestTimeSlot = (time) => {
        // Simple implementation - just match the hour
        const hour = parseInt(time.split(':')[0], 10);
        const ampm = time.includes('PM') && hour !== 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const closestSlot = `${hour12}:00 ${ampm}`;
        
        // Return the closest slot that exists in our timeSlots array
        return timeSlots.includes(closestSlot) ? closestSlot : timeSlots[0];
    };

    return (
        <Box p={3}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>My Timetable</Typography>
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Time / Day</StyledTableCell>
                                {daysOfWeek.map(day => (
                                    <StyledTableCell key={day} align="center">{day}</StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timeSlots.map(timeSlot => (
                                <TableRow key={timeSlot}>
                                    <StyledTimeCell>{timeSlot}</StyledTimeCell>
                                    {daysOfWeek.map(day => {
                                        const classes = timetableData[day]?.[timeSlot] || [];
                                        return (
                                            <ClassCell key={`${day}-${timeSlot}`} type={classes[0]?.type || 'class'}>
                                                {classes.length > 0 ? (
                                                    classes.map((entry, index) => (
                                                        <Box key={index} sx={{ mb: 1 }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                                {entry.subject?.subName} ({entry.type})
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Teacher: {entry.teacher?.name}
                                                            </Typography>
                                                            {entry.description && (
                                                                <Typography variant="caption" display="block">
                                                                    {entry.description}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                        No class
                                                    </Typography>
                                                )}
                                            </ClassCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default StudentTimetable; 