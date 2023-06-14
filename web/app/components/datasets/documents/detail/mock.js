export default {
    "id": "a7423c85-42db-4fd8-956d-f76e8e427887",
    "position": 6,
    "data_source_type": "upload_file",
    "data_source_info": {
        "upload_file": {
            "id": "3edcd8de-ffa6-455e-8f61-8e18ad9cd7c5",
            "name": "\u661f\u5df4\u514b\u5496\u5561Starbucks2023\u8d22\u5e74\u7b2c\u4e8c\u5b63\u5ea6\u8d22\u62a5\u82f1\u6587\u724847\u9875.pdf",
            "size": 1021676,
            "extension": "pdf",
            "mime_type": "application/pdf",
            "created_by": "f88a3b90-14e5-4e4f-bfbb-8475e4262505",
            "created_at": 1685354950.912123
        }
    },
    "dataset_process_rule_id": "29f3bf55-648b-4624-b42c-0fe223853069",
    "dataset_process_rule": {
        "mode": "automatic",
        "rules": {
            "pre_processing_rules": [
                {
                    "id": "remove_extra_spaces",
                    "enabled": true
                },
                {
                    "id": "remove_urls_emails",
                    "enabled": false
                }
            ],
            "segmentation": {
                "delimiter": "\n",
                "max_tokens": 1000
            }
        }
    },
    "name": "\u661f\u5df4\u514b\u5496\u5561Starbucks2023\u8d22\u5e74\u7b2c\u4e8c\u5b63\u5ea6\u8d22\u62a5\u82f1\u6587\u724847\u9875.pdf",
    "created_from": "web",
    "created_by": "f88a3b90-14e5-4e4f-bfbb-8475e4262505",
    "created_at": 1685354958.0,
    "tokens": 33834,
    "indexing_status": "completed",
    "completed_at": 1685354963,
    "updated_at": 1685354958,
    "indexing_latency": 4.59735483804252,
    "error": null,
    "enabled": true,
    "disabled_at": null,
    "disabled_by": null,
    "archived": false,
    "segment_count": 35,
    "average_segment_length": 3556,
    "hit_count": 0,
    "display_status": "available"
}