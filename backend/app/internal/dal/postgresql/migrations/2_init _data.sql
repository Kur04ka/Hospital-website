--------------------------- INSERT DATA ---------------------------

------- users -------

-- Password 12345
INSERT INTO public.users 
	(email, password, name, surname, sex, birth_date, phone_number, created_at, is_verified)
	VALUES 
	('test1@mail.ru', '646b77663b6c6a6577706f70306639733970666a696f323d5b615d63615b666b61775d5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 
	 'Иван', 'Курочкин', 'Мужчина', '2004-11-17', '+7(962)069-49-63', '2024-05-25', true);
INSERT INTO public.users 
	(email, password, name, surname, sex, birth_date, phone_number, created_at, is_verified)
	VALUES 
	('test2@mail.ru', '646b77663b6c6a6577706f70306639733970666a696f323d5b615d63615b666b61775d5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 
	 'Анна', 'Томазова', 'Женщина', '1973-11-21', '+7(963)183-73-37', '2024-05-25', true);
	

------- doctor -------
 
INSERT INTO public.doctor 
	(fullname, speciality, description, medical_degree, work_experience) VALUES
	('Алиев Джейхун Ильясович', 'хирург', 'Самый лучший Хирург', 'Доктор Медицинских Наук', 5);
INSERT INTO public.doctor 
	(fullname, speciality, description, medical_degree, work_experience) VALUES
	('Быков Андрей Евгеньевич', 'педиатр', 'Самый лучший Педиатр', 'Кандидат Медицинских Наук', 10);
INSERT INTO public.doctor 
	(fullname, speciality, description, medical_degree, work_experience) VALUES
	('Романенко Глеб Викторович', 'педиатр', 'Оболтус', 'Балбес', 1);
INSERT INTO public.doctor 
	(fullname, speciality, description, medical_degree, work_experience, is_head_doctor) VALUES
	('Кисегач Анастасия Константиновна', 'главный врач', 'Самый лучший Главный Врач', 'Доктор Медицинских Наук', 7, true);
	
	
------- appointment -------
	
INSERT INTO public.appointment 
	(patient_uuid, doctor_id, begins_at, ends_at, is_available) VALUES
	('295c272f-59e3-49db-bcf8-014f86ecc39d', 1, '2024-05-26 10:00:00', '2024-05-26 10:30:00', false);
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(1, '2024-05-26 10:30:00', '2024-05-26 11:00:00', true);
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(1, '2024-05-26 11:00:00', '2024-05-26 11:30:00', true);
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(1, '2024-05-26 11:30:00', '2024-05-26 12:00:00', true);
	
INSERT INTO public.appointment 
	(patient_uuid, doctor_id, begins_at, ends_at, is_available) VALUES
	('295c272f-59e3-49db-bcf8-014f86ecc39d', 1, '2024-05-29 10:00:00', '2024-05-29 10:30:00', false);
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(1, '2024-05-29 10:30:00', '2024-05-29 11:00:00', true);
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(1, '2024-05-29 11:00:00', '2024-05-29 11:30:00', true);
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(1, '2024-05-29 11:30:00', '2024-05-29 12:00:00', true);
	
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(2, '2024-05-26 10:00:00', '2024-05-26 10:30:00', true);
INSERT INTO public.appointment 
	(patient_uuid, doctor_id, begins_at, ends_at, is_available) VALUES
	('295c272f-59e3-49db-bcf8-014f86ecc39d', 2, '2024-05-26 10:30:00', '2024-05-26 11:00:00', false);
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(2, '2024-05-26 11:00:00', '2024-05-26 11:30:00', true);
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(2, '2024-05-26 11:30:00', '2024-05-26 12:00:00', true);
	
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(2, '2024-05-30 10:00:00', '2024-05-30 10:30:00', true);
INSERT INTO public.appointment 
	(patient_uuid, doctor_id, begins_at, ends_at, is_available) VALUES
	('295c272f-59e3-49db-bcf8-014f86ecc39d', 2, '2024-05-30 10:30:00', '2024-05-30 11:00:00', false);
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(2, '2024-05-30 11:00:00', '2024-05-30 11:30:00', true);
INSERT INTO public.appointment 
	(doctor_id, begins_at, ends_at, is_available) VALUES
	(2, '2024-05-30 11:30:00', '2024-05-30 12:00:00', true);
	
------- news -------

INSERT INTO public.news
	(title, short_body, full_body, publication_date) VALUES
	('Минимизируем риск невралгии',
	 'О том, что такое невралгия и как минимизировать ее риск...',
	 'Невралгия - это когда нервы дают о себе знать, вызывая острую боль. Она может случиться в любой части тела, но чаще всего «любимые» места - это лицо (так называемая тригеминальная невралгия) и поясница. Невралгия - это не шутки, это реально сильная боль, которая проходит вдоль нерва. Представьте себе электрический провод, по которому вдруг пошли перебои, искры и замыкания. Вот примерно так же и нерв «замыкает» от раздражения или повреждения. Почему это происходит? Причин может быть много: от обычного переохлаждения до серьезных заболеваний позвоночника, инфекций, диабета и даже опухолей головного мозга. Иногда невралгия возникает после травмы или как побочный эффект после инфекционных заболеваний. Как лечится? Лечение невралгии — это не быстрый процесс, и здесь важно строго следовать рекомендациям врача. Обычно в арсенале орудий борьбы с невралгией есть: - Медикаментозное лечение: обезболивающие, противовоспалительные препараты, а иногда и антиконвульсанты или миорелаксанты. - Физиотерапия: может помочь уменьшить воспаление и боль. - Массаж и акупунктура: эти методы помогают расслабить мышцы и улучшить кровообращение. - Лечебная физкультура: специально подобранные упражнения могут укрепить мышцы и предотвратить повторное возникновение болей. Профилактика Чтобы минимизировать риск невралгии, можно придерживаться нескольких простых правил: Активный образ жизни: регулярные упражнения помогают поддерживать мышцы в тонусе. Правильное питание: нужно получать достаточное количество витаминов и минералов, особенно группы B. Избегание стрессов и переутомления: стресс может спровоцировать множество заболеваний, включая невралгию. Рациональное рабочее место: если работаешь за компьютером, следи за тем, чтобы стул и стол были удобными, экран находился на уровне глаз. Если чувствуете, что что-то не так, лучше не затягивайте с визитом к доктору.',
	 '2024-05-15');
INSERT INTO public.news
	(title, short_body, full_body, publication_date) VALUES
	('Есть шанс, что династия зарождается прямо сейчас, именно с нас',
	 'Прекрасное письмо на фотомарафон «Моя семья - медицина» пришло от ...',
	 '«На черно-белых снимках моя бабушка – Любовь Александровна  Лобанова, проработавшая медицинской сестрой почти 50 лет (46 лет, если быть точной) и отдавшая большую часть своей жизни помощи людям. Окончив в 1967 году Северо-Казахстанский высший медицинский колледж в Петропавловске (на фото верхний ряд, вторая справа), она сразу начала работать в стационаре в Петропавловске.',	 
	 '2024-05-26');


------- review -------


INSERT INTO public.review 
	(rating, patient_uuid, body, publication_date) VALUES
	(5, 
	 '295c272f-59e3-49db-bcf8-014f86ecc39d', 
	 'От всей души рекомендую эту клинику! С момента входа чувствуется забота и внимание к пациентам. Персонал вежливый и приветливый, врачи — настоящие профессионалы своего дела. Процедуры прошли быстро и безболезненно, а результаты превзошли все ожидания. Особенно понравилась чистота и современное оборудование. Спасибо за отличный сервис и заботу о здоровье пациентов! Буду рекомендовать вас всем своим знакомым!',
	 '2024-05-14'
	);
INSERT INTO public.review 
	(rating, patient_uuid, body, publication_date) VALUES
	(4, 
	 '295c272f-59e3-49db-bcf8-014f86ecc39d', 
	 'Прекрасная клиника с отличным персоналом! С самого начала чувствуется профессионализм и забота. Врачи очень внимательные и компетентные, подробно объясняют каждый шаг. Процедуры проходят комфортно, без лишнего стресса. Радует современное оборудование и чистота в каждом уголке. Здесь действительно заботятся о пациентах и их здоровье. Огромное спасибо всей команде за отличный сервис! Рекомендую всем!',
	 '2024-05-05'
	);
	

