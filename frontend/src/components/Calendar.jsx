import React from 'react';
import {
  Row,
  Col,
} from 'react-bootstrap';
import Sidebar from './Sidebar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Container } from 'react-bootstrap';

function Calendar() {

  return (
    <div className="container-fluid">
      <Row>
        <Col md={2} className="bg-primary text-white">
          <Sidebar />
        </Col>
        <Col md={10}>
          <Container className="p-4">
            <FullCalendar 
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
            />
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default Calendar;