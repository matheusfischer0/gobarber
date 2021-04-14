import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository'

import CreateAppointmentService from './CreateAppointmentService';

import AppError from '@shared/errors/AppError'

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe("CreateAppointment", ()=>{

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  });

  // TEST ON CREATE APPOINTMENT
  it('should be able to create a new appointment', async ()=>{
    const appointment = await createAppointment.execute({date:new Date(), provider_id:'12341234'})

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12341234');
  })

  // TEST ON ERROR
  it('should not be able to create two appointments on the same time', async ()=>{
    const fakeDate = new Date(2020, 4, 10, 11);
    const appointment = await createAppointment.execute({
      date: fakeDate,
      provider_id: '12341234',
    });

    expect(createAppointment.execute({
      date: fakeDate,
      provider_id: '12341234',
    })).rejects.toBeInstanceOf(AppError)
  })
})
