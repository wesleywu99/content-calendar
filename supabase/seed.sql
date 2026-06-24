insert into insights (id, title, source, summary, llm_insight, fingerprint, captured_at) values
 ('11111111-1111-1111-1111-111111111111','端午節前一週，XHS「節慶限定」聲量 +180%','trend','...','端午檔期推限定口味回歸 + 家庭情感，XHS 優先','demo_ins_1','2026-06-22'),
 ('22222222-2222-2222-2222-222222222222','競品推教學短影音，留言詢問度高','competitor','...','我方可搶攻「使用教學」內容空缺','demo_ins_2','2026-06-21');

insert into content_items (title, platform, publish_date, caption, content_status, insight_id, fingerprint) values
 ('端午企劃·限時口味回歸','xiaohongshu','2026-06-26','端午節限定口味回來啦！…','draft','11111111-1111-1111-1111-111111111111','demo_ins_1:xiaohongshu'),
 ('端午企劃·限時口味回歸','instagram','2026-06-26','記憶中的那口味道…','draft','11111111-1111-1111-1111-111111111111','demo_ins_1:instagram'),
 ('產品使用教學 EP1','instagram','2026-06-28','三步學會正確使用！…','review','22222222-2222-2222-2222-222222222222','demo_ins_2:instagram'),
 ('客戶見證貼','facebook','2026-06-25','「用了三個月，回不去了。」','approved',null,'manual_testimonial'),
 ('幕後花絮·團隊日常','instagram','2026-06-30',null,'idea',null,'manual_behind'),
 ('競品熱題回應·教學系列','xiaohongshu','2026-07-02','使用訣竅整理給你！…','draft','22222222-2222-2222-2222-222222222222','demo_ins_2:xiaohongshu');
