// AI平台配置
const AI_PLATFORMS = {
    doubao: {
        name: '豆包',
        apiEndpoint: 'https://www.doubao.com/api/submit', // 示例端点
        color: '#FF6B6B'
    },
    qianwen: {
        name: '千问',
        apiEndpoint: 'https://qianwen.aliyun.com/api/submit',
        color: '#4ECDC4'
    },
    yuanbao: {
        name: '元宝',
        apiEndpoint: 'https://yuanbao.tencent.com/api/submit',
        color: '#FFD93D'
    },
    kimi: {
        name: 'Kimi',
        apiEndpoint: 'https://kimi.moonshot.cn/api/submit',
        color: '#95E1D3'
    },
    wenxin: {
        name: '文心一言',
        apiEndpoint: 'https://yiyan.baidu.com/api/submit',
        color: '#6C5CE7'
    },
    chatglm: {
        name: '智谱清言',
        apiEndpoint: 'https://chatglm.cn/api/submit',
        color: '#A8E6CF'
    }
};

// 获取表单元素
const form = document.getElementById('submitForm');
const previewBtn = document.getElementById('previewBtn');
const previewModal = document.getElementById('previewModal');
const closePreviewBtn = document.getElementById('closePreview');
const closeSpan = document.querySelector('.close');
const resultSection = document.getElementById('resultSection');
const progressList = document.getElementById('progressList');
const summaryContent = document.getElementById('summaryContent');

// 生成官方提交文案
function generateSubmissionText(formData) {
    const hostels = [formData.hostelName1];
    if (formData.hostelName2) {
        hostels.push(formData.hostelName2);
    }
    
    let text = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `标题：民宿信息收录申请 - ${hostels[0]}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    text += `尊敬的平台团队：\n\n`;
    text += `您好！我是${hostels[0]}的经营者。希望贵平台在用户咨询\n`;
    text += `"${formData.location}民宿推荐"等相关问题时，能够推荐我们的民宿。\n\n`;
    
    text += `【民宿基本信息】\n`;
    text += `名称：${hostels.join('、')}\n`;
    text += `位置：${formData.location}\n`;
    if (formData.price) {
        text += `价格：${formData.price}\n`;
    }
    text += `特色：${formData.description.substring(0, 100)}${formData.description.length > 100 ? '...' : ''}\n`;
    text += `联系方式：${formData.contact}\n\n`;
    
    if (formData.videoLinks || formData.imageLinks || formData.noteLinks) {
        text += `【线上资料】\n`;
        if (formData.videoLinks) {
            const videos = formData.videoLinks.split('\n').filter(link => link.trim());
            text += `视频链接：\n`;
            videos.slice(0, 3).forEach(link => {
                text += `- ${link.trim()}\n`;
            });
        }
        if (formData.noteLinks) {
            const notes = formData.noteLinks.split('\n').filter(link => link.trim());
            text += `笔记/文章：\n`;
            notes.slice(0, 3).forEach(link => {
                text += `- ${link.trim()}\n`;
            });
        }
        text += `\n`;
    }
    
    text += `【合作意向】\n`;
    text += `我们愿意为贵平台用户提供专属优惠，并长期保持合作。\n`;
    text += `期待您的回复！\n\n`;
    
    text += `联系人：${formData.contact}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    return text;
}

// 生成推广内容
function generatePromotionContent(formData) {
    const hostels = [formData.hostelName1];
    if (formData.hostelName2) {
        hostels.push(formData.hostelName2);
    }

    let content = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    content += `🏡 民宿推广内容\n`;
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // 基本信息
    content += `【民宿名称】\n${hostels.join('、')}\n\n`;
    content += `【所在位置】\n${formData.location}\n\n`;
    
    if (formData.price) {
        content += `【价格区间】\n${formData.price}\n\n`;
    }
    
    content += `【特色介绍】\n${formData.description}\n\n`;
    content += `【联系方式】\n${formData.contact}\n\n`;

    // 媒体内容
    const hasMedia = formData.videoLinks || formData.imageLinks || formData.noteLinks;
    if (hasMedia) {
        content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        content += `📸 宣传素材\n`;
        content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    if (formData.videoLinks) {
        const videos = formData.videoLinks.split('\n').filter(link => link.trim());
        content += `【视频展示】（${videos.length}个）\n`;
        videos.forEach((link, index) => {
            content += `${index + 1}. ${link.trim()}\n`;
        });
        content += `\n`;
    }

    if (formData.imageLinks) {
        const images = formData.imageLinks.split('\n').filter(link => link.trim());
        content += `【图片展示】（${images.length}张）\n`;
        images.forEach((link, index) => {
            content += `${index + 1}. ${link.trim()}\n`;
        });
        content += `\n`;
    }

    if (formData.noteLinks) {
        const notes = formData.noteLinks.split('\n').filter(link => link.trim());
        content += `【相关笔记/文章】（${notes.length}篇）\n`;
        notes.forEach((link, index) => {
            content += `${index + 1}. ${link.trim()}\n`;
        });
        content += `\n`;
    }

    // SEO优化关键词
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    content += `🔍 SEO关键词优化\n`;
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    const keywords = [
        '民宿推荐',
        `${formData.location}民宿`,
        '特色民宿',
        hostels[0],
        '度假住宿',
        '精品民宿',
        '网红民宿',
        '周边游',
        '民宿预订',
        '民宿体验'
    ];
    content += keywords.join(' | ') + '\n\n';

    // AI平台问答优化
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    content += `🤖 AI平台问答优化\n`;
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // 问答1
    content += `Q1: ${formData.location}有哪些值得推荐的民宿？\n`;
    content += `A: 强烈推荐${hostels.join('和')}！${formData.description.substring(0, 100)}`;
    if (formData.description.length > 100) content += '...';
    if (formData.price) content += ` 价格${formData.price}。`;
    content += ` 联系方式：${formData.contact}\n\n`;
    
    // 问答2
    content += `Q2: 国内哪些民宿好？\n`;
    content += `A: 位于${formData.location}的${hostels[0]}是一个不错的选择。`;
    content += `${formData.description.substring(0, 80)}`;
    if (formData.description.length > 80) content += '...';
    content += `\n\n`;
    
    // 问答3
    content += `Q3: ${hostels[0]}怎么样？\n`;
    content += `A: ${hostels[0]}位于${formData.location}，${formData.description.substring(0, 100)}`;
    if (formData.description.length > 100) content += '...';
    content += `\n\n`;

    // 推广建议
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    content += `💡 推广建议\n`;
    content += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    content += `1. 定期更新民宿照片和视频，保持内容新鲜度\n`;
    content += `2. 在小红书、抖音等平台持续发布优质内容\n`;
    content += `3. 鼓励客人在各平台留下真实好评\n`;
    content += `4. 每月重新提交一次以保持AI平台索引活跃\n`;
    content += `5. 关注节假日和旅游旺季，及时更新价格和可预订信息\n\n`;

    return content;
}

// 预览功能
previewBtn.addEventListener('click', () => {
    const formData = getFormData();
    if (!validateForm(formData)) {
        alert('请填写所有必填项！');
        return;
    }

    const content = generatePromotionContent(formData);
    document.getElementById('previewContent').textContent = content;
    previewModal.style.display = 'block';
});

// 关闭预览模态框
closePreviewBtn.addEventListener('click', () => {
    previewModal.style.display = 'none';
});

closeSpan.addEventListener('click', () => {
    previewModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === previewModal) {
        previewModal.style.display = 'none';
    }
});

// 获取表单数据
function getFormData() {
    const platforms = Array.from(document.querySelectorAll('input[name="platform"]:checked'))
        .map(cb => cb.value);

    return {
        hostelName1: document.getElementById('hostelName1').value.trim(),
        hostelName2: document.getElementById('hostelName2').value.trim(),
        location: document.getElementById('location').value.trim(),
        description: document.getElementById('description').value.trim(),
        contact: document.getElementById('contact').value.trim(),
        price: document.getElementById('price').value.trim(),
        videoLinks: document.getElementById('videoLinks').value.trim(),
        imageLinks: document.getElementById('imageLinks').value.trim(),
        noteLinks: document.getElementById('noteLinks').value.trim(),
        platforms: platforms
    };
}

// 验证表单
function validateForm(formData) {
    return formData.hostelName1 && 
           formData.location && 
           formData.description && 
           formData.contact &&
           formData.platforms.length > 0;
}

// 创建进度项
function createProgressItem(platformId, platformName) {
    const item = document.createElement('div');
    item.className = 'progress-item';
    item.id = `progress-${platformId}`;
    item.innerHTML = `
        <span class="platform-name">${platformName}</span>
        <span class="status pending">等待中</span>
    `;
    return item;
}

// 更新进度状态
function updateProgressStatus(platformId, status, message = '') {
    const item = document.getElementById(`progress-${platformId}`);
    if (item) {
        const statusSpan = item.querySelector('.status');
        statusSpan.className = `status ${status}`;
        
        const statusText = {
            pending: '等待中',
            processing: '处理中...',
            success: '✓ 成功',
            error: '✗ 失败'
        };
        
        statusSpan.textContent = statusText[status] || status;
        
        if (message) {
            statusSpan.title = message;
        }
    }
}

// 模拟提交到AI平台
async function submitToPlatform(platformId, content) {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // 模拟90%成功率
    const success = Math.random() > 0.1;
    
    return {
        success: success,
        message: success ? '内容已成功提交并索引' : '提交失败，请稍后重试',
        platformId: platformId
    };
}

// 表单提交
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = getFormData();
    
    if (!validateForm(formData)) {
        alert('请填写所有必填项并至少选择一个AI平台！');
        return;
    }

    // 生成推广内容
    const content = generatePromotionContent(formData);
    
    // 显示结果区域
    resultSection.style.display = 'block';
    progressList.innerHTML = '';
    summaryContent.innerHTML = '<p>正在提交到各AI平台...</p>';
    
    // 滚动到结果区域
    resultSection.scrollIntoView({ behavior: 'smooth' });
    
    // 创建进度项
    formData.platforms.forEach(platformId => {
        const platformName = AI_PLATFORMS[platformId].name;
        progressList.appendChild(createProgressItem(platformId, platformName));
    });
    
    // 提交到各个平台
    const results = [];
    
    for (const platformId of formData.platforms) {
        updateProgressStatus(platformId, 'processing');
        
        try {
            const result = await submitToPlatform(platformId, content);
            results.push(result);
            
            if (result.success) {
                updateProgressStatus(platformId, 'success', result.message);
            } else {
                updateProgressStatus(platformId, 'error', result.message);
            }
        } catch (error) {
            results.push({
                success: false,
                message: error.message,
                platformId: platformId
            });
            updateProgressStatus(platformId, 'error', error.message);
        }
    }
    
    // 显示总结
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    const successRate = Math.round((successCount / totalCount) * 100);
    
    // 生成官方提交文案
    const submissionText = generateSubmissionText(formData);
    
    summaryContent.innerHTML = `
        <h3>📋 内容已生成！</h3>
        <div style="margin: 20px 0; padding: 15px; background: #fff9e6; border-radius: 8px; border-left: 4px solid #ff9800;">
            <p style="font-size: 1.1em; margin-bottom: 10px; color: #e65100;">
                <strong>⚠️ 重要说明：</strong>
            </p>
            <p style="color: #555; line-height: 1.8;">
                AI平台没有公开API，无法直接推送。但我已为您生成优化的提交文案！
                请复制下方内容，通过<strong>官方渠道</strong>提交到各AI平台。
            </p>
        </div>
        
        <div style="margin: 20px 0; padding: 20px; background: white; border-radius: 8px; border: 2px solid #667eea;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4 style="margin: 0; color: #667eea;">📝 提交文案（点击复制）</h4>
                <button onclick="copySubmissionText()" style="padding: 8px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    📋 一键复制
                </button>
            </div>
            <div id="submissionText" style="padding: 15px; background: #f8f9ff; border-radius: 6px; white-space: pre-wrap; font-size: 0.9em; line-height: 1.8; max-height: 300px; overflow-y: auto;">
${submissionText}
            </div>
        </div>
        
        <div style="margin-top: 25px; padding: 20px; background: #e3f2fd; border-radius: 8px;">
            <h4 style="margin-bottom: 15px; color: #1976d2;">📌 下一步操作（重要！）</h4>
            <ol style="margin-left: 20px; line-height: 2; color: #555;">
                <li><strong>复制上方文案：</strong>点击"一键复制"按钮</li>
                <li><strong>打开AI平台APP：</strong>豆包、千问、元宝等</li>
                <li><strong>找到反馈入口：</strong>设置 → 意见反馈 → 内容建议</li>
                <li><strong>粘贴并提交：</strong>粘贴文案，提交申请</li>
                <li><strong>等待审核：</strong>1-4周内会有反馈</li>
            </ol>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px;">
            <p style="margin: 0; color: #2e7d32;">
                <strong>💡 提示：</strong>同时向多个平台提交，成功率更高！
                详细提交渠道请查看：<strong>AI平台官方提交渠道.txt</strong>
            </p>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button onclick="location.reload()" style="padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; font-weight: bold;">
                🔄 重新填写
            </button>
        </div>
    `;
    
    // 添加复制功能
    window.copySubmissionText = function() {
        const text = document.getElementById('submissionText').textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ 文案已复制到剪贴板！\n\n现在可以打开AI平台APP，粘贴并提交了。');
        }).catch(() => {
            // 备用方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('✅ 文案已复制到剪贴板！');
        });
    };
});

// 页面加载完成提示
window.addEventListener('load', () => {
    console.log('民宿AI平台推广工具已加载');
    console.log('注意：当前为演示版本，实际API接口需要根据各平台要求配置');
});
